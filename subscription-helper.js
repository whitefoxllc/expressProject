var db = require('./db-helper.js');


var clearSessionSubscriptionData = function (req) {
    req.session.subscriptionActiveUntil = null;
    req.session.slotsAllowed = 0;
    req.session.activeSlots = 0;
    req.session.slots = [];
};

var syncSessionWithDb = function (req, callback) {
    clearSessionSubscriptionData(req);
    db.readOnlyConnection.query(`SELECT * FROM subscriptions WHERE subscriber = "${req.session.user}";`, function(err, rows, fields) {
        if (rows.length > 0) {
            req.session.subscriptionActiveUntil = rows[0].subscriptionExpiry;
            req.session.slotsAllowed = rows[0].slotCount;

            db.readOnlyConnection.query(`SELECT * FROM slots WHERE subscriber = "${req.session.user}";`, function(err, rows, fields) {
                // req.session.slots = [];
                req.session.activeSlots = rows.length;
                rows.forEach(function (slot) {
                    req.session.slots.push({"productionID": slot.production, "expiryDate": slot.expiry})
                });
                callback();
            });
        }
        else {
            callback();
        }
    });
};

var activateSubscription = function (req, slots, callback) {
    var expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    db.writeSubscriptionsConnection.query(`INSERT INTO subscriptions VALUES("${req.session.user}","${expiryDate.toISOString()}","${slots}");`, function (err, rows, fields) {
        req.session.subscriptionActiveUntil = expiryDate;
        req.session.slotsAllowed = slots;
        req.session.activeSlots = 0;
        req.session.slots = [];
        callback();
    });
};

var renewSubscription = function (req, callback) {
    var expiryDate = new Date(req.session.subscriptionActiveUntil);
    expiryDate.setDate(expiryDate.getDate() + 30);
    db.writeSubscriptionsConnection.query(`UPDATE subscriptions SET subscriptionExpiry = "${expiryDate.toISOString()}" WHERE subscriber = "${req.session.user}";`, function (err, rows, fields) {
        req.session.subscriptionActiveUntil = expiryDate;
        callback();
    });
};

var cancelSubscription = function (req, callback) {
    db.writeProdsConnection.query(`DELETE FROM subscriptions WHERE subscriber = "${req.session.user}";`, function (err, rows, fields) {
        req.session.subscriptionActiveUntil = null;
        req.session.slotsAllowed = 0;
        req.session.activeSlots = 0;
        callback();
    });
};

var subscriptionActive = function (req) {
    var now = new Date();
    return (req.session.subscriptionActiveUntil > now);
};

var hasAccessTo = function (req, production) {
    var accessible = false;
    if (subscriptionActive(req)) {
        req.session.slots.forEach(function (slot) {
            if (slot.productionID === production) {
                accessible = true;
            }
        });
    }

    return accessible;
};

var grantAccessTo = function (req, production, callback) {
    var grantSuccessful = false;
    if (req.session.subscriptionActiveUntil && req.session.activeSlots < req.session.slotsAllowed) {
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        db.writeSubscriptionsConnection.query(`INSERT INTO slots VALUES("${req.session.user}","${production}","${expiryDate.toISOString()}");`, function (err, rows, fields) {
            req.session.slots.push({"productionID": production, "expiryDate": expiryDate});
            req.session.activeSlots += 1;
            return callback(true);
        });
    }
    else {
        return callback(false);
    }
};

var requestAccessTo = function (req, production, callback) {
    if (hasAccessTo(req, production)) {
        callback(true);
    }
    else {
        grantAccessTo(req, production, function (success) {
            callback(success);
        });
    }
};

var removeAccessTo = function (req, production) {
    for (var i = 0; i < req.session.slots.length; i++) {
        if (req.session.slots[i].productionID === production) {
            req.session.slots.splice(i, 1);
            req.session.activeSlots -= 1;
            db.writeProdsConnection.query(`DELETE FROM slots WHERE subscriber = "${req.session.user}" AND production = "${production}";`);
        }
    }
};

//not yet tested
var refreshAccessLists = function (req, callback) {
    var now = new Date();
    req.session.slots.forEach(function (slot) {
        if (slot.expiryDate < now) {
            removeAccessTo(req, slot.productionID, callback);
        }
    });
};




exports = module.exports = {syncSessionWithDb, activateSubscription, renewSubscription, cancelSubscription, subscriptionActive, hasAccessTo, grantAccessTo, requestAccessTo, removeAccessTo, refreshAccessLists};
