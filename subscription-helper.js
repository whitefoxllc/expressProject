const db = require('./db-helper.js');
const dates = require('./date-helper');

var clearSessionSubscriptionData = function (req) {
    req.session.subscriptionActiveUntil = null;
    req.session.slotsAllowed = 0;
    req.session.activeSlots = 0;
    req.session.slots = [];
};

var syncSessionWithDb = function (req, callback) {
    clearSessionSubscriptionData(req);
    db.readOnlyConnection.query(`SELECT * FROM subscriptions WHERE subscriber = "${req.session.user}";`, {}, function(err, rows, fields) {
        if(err) throw err;
        if (rows.length > 0) {
            req.session.subscriptionActiveUntil = dates.dateFromSqlDatetime(rows[0].subscriptionExpiry);
            req.session.slotsAllowed = rows[0].slotCount;
        }

        db.readOnlyConnection.query(`SELECT * FROM slots WHERE subscriber = "${req.session.user}";`, {}, function(err, rows, fields) {
            if(err) throw err;

            req.session.activeSlots = rows.length;
            rows.forEach(function (slot) {
                req.session.slots.push({"productionID": slot.production, "expiryDate": dates.dateFromSqlDatetime(slot.expiry)})
            });

            callback();
        });
    });
};

var activateSubscription = function (req, slotsAllowed, callback) {
    var expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    db.writeSubscriptionsConnection.query(`INSERT INTO subscriptions VALUES("${req.session.user}","${dates.dateToSqlDatetime(expiryDate)}","${slotsAllowed}");`, {}, function (err, rows, fields) {
        if (err) throw err;
        req.session.subscriptionActiveUntil = expiryDate;
        req.session.slotsAllowed = slotsAllowed;
        req.session.activeSlots = 0;
        req.session.slots = [];
        callback();
    });
};

var renewSubscription = function (req, callback) {
    var expiryDate = new Date(req.session.subscriptionActiveUntil);
    expiryDate.setDate(expiryDate.getDate() + 30);
    db.writeSubscriptionsConnection.query(`UPDATE subscriptions SET subscriptionExpiry = "${dates.dateToSqlDatetime(expiryDate)}" WHERE subscriber = "${req.session.user}";`, {}, function (err, rows, fields) {
        if (err) throw err;
        req.session.subscriptionActiveUntil = expiryDate;
        callback();
    });
};

var cancelSubscription = function (req, callback) {
    db.writeProdsConnection.query(`DELETE FROM subscriptions WHERE subscriber = "${req.session.user}";`, {}, function (err, rows, fields) {
        if (err) throw err;
        req.session.subscriptionActiveUntil = null;
        req.session.slotsAllowed = 0;
        req.session.activeSlots = 0;
        callback();
    });
};

var subscriptionActive = function (req) {
    let now = new Date();
    let expiry = new Date(req.session.subscriptionActiveUntil);
    return (expiry > now);
};

var hasAccessTo = function (req, production) {
    var accessible = false;
    if (subscriptionActive(req)) {
        let now = new Date();
        let refreshedSlots = [];
            ////prune expired slots, and set accessible if an unexpired slot exists for the production
        req.session.slots.forEach(function (slot) {
            var expiry = new Date(slot.expiryDate);
            if (expiry > now) {
                refreshedSlots.push(slot);
                if (slot.productionID === production) {
                    accessible = true;
                }
            }
            else {
                req.session.activeSlots -= 1;
            }
        });

        req.session.slots = refreshedSlots;
    }

    return accessible;
};

var grantAccessTo = function (req, production, callback) {
    var grantSuccessful = false;
    if (hasAccessTo(req, production)) {
        return callback(true);
    }
    else if (req.session.subscriptionActiveUntil && req.session.activeSlots < req.session.slotsAllowed) {
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        db.writeSubscriptionsConnection.query(`delete from slots where subscriber='${req.session.user}' and production='${production}'`, function (err, rows, fields) {
            if (err) throw err;
            db.writeSubscriptionsConnection.query(`insert into slots values("${req.session.user}","${production}","${dates.dateToSqlDatetime(expiryDate)}");`, {}, function (err, rows, fields) {
                if (err) throw err;
                req.session.slots.push({"productionID": production, "expiryDate": expiryDate});
                req.session.activeSlots += 1;
                return callback(true);
            });
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

var removeAccessTo = function (req, production, callback) {
    for (var i = 0; i < req.session.slots.length; i++) {
        if (req.session.slots[i].productionID === production) {
            req.session.slots.splice(i, 1);
            req.session.activeSlots -= 1;
            db.writeProdsConnection.query(`DELETE FROM slots WHERE subscriber = "${req.session.user}" AND production = "${production}";`, function () {
                callback();
            });
        }
    }
};

exports = module.exports = {clearSessionSubscriptionData, syncSessionWithDb, activateSubscription, renewSubscription, cancelSubscription, subscriptionActive, hasAccessTo, grantAccessTo, requestAccessTo, removeAccessTo};
