// function isoToSqlDatetime(isoString) {
//     return String(isoString).substring(0, 10) + " " + String(isoString).substring(11, 19);
// }

function dateToSqlDatetime(date) {
    let isoString = date.toISOString();
    return String(isoString).substring(0, 10) + " " + String(isoString).substring(11, 19);
}

function dateFromSqlDatetime(datetime) {
    let date = new Date(datetime + " UTC");
    return date;
}

function timesAreApproximatelyEqual(t1, t2) {
    let differenceInMilliseconds = Math.abs(t1  - t2);
    return  differenceInMilliseconds < 10000;
}

exports = module.exports = {dateToSqlDatetime, dateFromSqlDatetime, timesAreApproximatelyEqual};