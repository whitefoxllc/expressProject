var db = require('./db-helper.js');

//not yet tested
var syncSessionWithDb = function (req, callback) {
    db.readOnlyConnection.query(`SELECT * FROM subscriptions WHERE subscriber = "${req.session.user}";`, function(err, rows, fields) {
        req.session.subscriptionActiveUntil = rows[0].subscriptionExpiry;
        req.session.slotsAllowed = rows[0].slotCount;
    });

    db.readOnlyConnection.query(`SELECT * FROM slots WHERE subscriber = "${req.session.user}";`, function(err, rows, fields) {
        req.session.slots = [];
        req.session.activeSlots = rows.length;
        rows.forEach(function (slot) {
        req.session.slots.push({"productionID": slot.production, "expiryDate": slot.expiry})

        });
    });
};

var activateSubscription = function (req, slots) {
    var expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    db.writeSubscriptionsConnection.query(`INSERT INTO subscriptions VALUES("${req.session.user}","${expiryDate.toISOString()}","${slots}");`); //probably not necessary to wait/callback
    req.session.subscriptionActiveUntil = expiryDate;
    req.session.slotsAllowed = slots;
    req.session.activeSlots = 0;
    req.session.slots = [];

};

var renewSubscription = function (req) {
    var expiryDate = new Date(req.session.subscriptionActiveUntil);
    expiryDate.setDate(expiryDate.getDate() + 30);
    db.writeSubscriptionsConnection.query(`UPDATE subscriptions SET subscriptionExpiry = "${expiryDate.toISOString()}" WHERE subscriber = "${req.session.user}";`); //probably not necessary to wait/callback
    req.session.subscriptionActiveUntil = expiryDate;
};

var cancelSubscription = function (req) {
    db.writeProdsConnection.query(`DELETE FROM subscriptions WHERE subscriber = "${req.session.user}";`); //probably not necessary to wait/callback
    req.session.subscriptionActiveUntil = null;
    req.session.slotsAllowed = 0;
    req.session.activeSlots = 0;
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

var grantAccessTo = function (req, production) {
    if (req.session.activeSlots < req.session.slotsAllowed) {
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        req.session.slots.push({"productionID": production, "expiryDate": expiryDate});
        req.session.activeSlots += 1;
        return true;
    }
    else {
        return false;
    }
};

var requestAccessTo = function (req, production) {
    if (hasAccessTo(req, production)) {
        return true;
    }
    else {
        return grantAccessTo(req, production);
    }
};

var removeAccessTo = function (req, production) {
    for (var i = 0; i < req.session.slots.length; i++) {
        if (req.session.slots[i].productionID === production) {
            req.session.slots.splice(i, 1);
            req.session.activeSlots -= 1;
        }
    }
};

//not yet tested
var refreshAccessLists = function (req) {
    var now = new Date();
    req.session.slots.forEach(function (slot) {
        if (slot.expiryDate < now) {
            removeAccessTo(req, slot.productionID);
            db.writeSubscriptionsConnection.query(`DELETE FROM slots WHERE subscriber = "${req.session.user}" AND production = "${production}";`); //probably not necessary to wait/callback
        }
    });
};




exports = module.exports = {activateSubscription, renewSubscription, cancelSubscription, subscriptionActive, hasAccessTo, grantAccessTo, requestAccessTo, removeAccessTo, refreshAccessLists};
