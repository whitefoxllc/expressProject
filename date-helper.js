// function isoToSqlDatetime(isoString) {
//     return String(isoString).substring(0, 10) + " " + String(isoString).substring(11, 19);
// }

function dateToSqlDatetime(date) {
    let isoString = date.toISOString();
    return String(isoString).substring(0, 10) + " " + String(isoString).substring(11, 19);
}

function dateFromSqlDatetime(datetime) {
    let date = new Date();
    date.setUTCFullYear(parseInt(datetime.substring(0, 4)));
    date.setUTCMonth(parseInt(datetime.substring(5, 7)));
    date.setUTCDate(parseInt(datetime.substring(8, 10)));
    date.setUTCHours(parseInt(datetime.substring(11, 13)));
    date.setUTCMinutes(parseInt(datetime.substring(14, 16)));
    date.setUTCSeconds(parseInt(datetime.substring(17, 18)));
    return date;
}

//strips the gmt offset from a UTC-format sql datetime which has been erroneously assigned an offset
function stripGmtOffset(date) {
    let correctDate = new Date();
    correctDate.setUTCFullYear(date.getFullYear());
    correctDate.setUTCMonth(date.getMonth());
    correctDate.setUTCDate(date.getDate());
    correctDate.setUTCHours(date.getHours(), date.getMinutes(), date.getSeconds());
    return correctDate;
}

function timesAreApproximatelyEqual(t1, t2) {
    let differenceInMilliseconds = Math.abs(t1  - t2);
    return  differenceInMilliseconds < 10000;
}

exports = module.exports = {dateToSqlDatetime, dateFromSqlDatetime, stripGmtOffset, timesAreApproximatelyEqual};