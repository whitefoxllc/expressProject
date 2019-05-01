const assert  = require('assert');

dates = require("../date-helper");


describe("date-helper", function () {

    describe("dateToSqlDatetime", function () {
        it("converts a Date object to YYYY-MM-DD hh:mm:ss format", function () {
            let now = new Date();
            let year = now.getUTCFullYear();
            let month = now.getUTCMonth() + 1; //UTC uses zero for January
            let date = now.getUTCDate();
            let hours = now.getUTCHours();
            let minutes = now.getUTCMinutes();
            let seconds = now.getUTCSeconds();
            let correctString = `${year}-${month >= 10 ? month : "0" + month}-${date >= 10 ? date : "0" + date} ${hours >= 10 ? hours : "0" + hours}:${minutes >= 10 ? minutes : "0" + minutes}:${seconds >= 10 ? seconds : "0" + seconds}`;

            assert.strictEqual(dates.dateToSqlDatetime(now), correctString);
        });
    });

    describe("dateFromSqlDatetime", function () {
        it("converts YYYY-MM-DD hh:mm:ss string to a Date function", function () {
            let dummySqlDatetime = "6969-04-20 16:20:00";
            let convertedDate = dates.dateFromSqlDatetime(dummySqlDatetime);

            assert.strictEqual(convertedDate.getUTCFullYear(), 6969);
            assert.strictEqual(convertedDate.getUTCMonth(), 4 - 1);
            assert.strictEqual(convertedDate.getUTCDate(), 20);
            assert.strictEqual(convertedDate.getUTCHours(), 16);
            assert.strictEqual(convertedDate.getUTCMinutes(), 20);
            assert.strictEqual(convertedDate.getUTCSeconds(), 0);

        });
    });

    describe("timesAreApproximatelyEqual-1", function () {
        it("returns true for date objects within 10sec of each other", function () {
            let now = new Date();
            let later = new Date();
            later.setSeconds(later.getSeconds() + 9);
            assert(dates.timesAreApproximatelyEqual(now, later));
        });
    });

    describe("timesAreApproximatelyEqual-2", function () {
        it("returns false for date objects more than 10sec different", function () {
            let now = new Date();
            let later = new Date();
            later.setSeconds(later.getSeconds() + 11);
            assert(!dates.timesAreApproximatelyEqual(now, later));
        });
    });
});


