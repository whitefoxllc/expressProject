var db = require('./db-helper.js');
var sub = require('./subscription-helper');

var getFileUrlFor = function (req, production, season, episode, callback) {
    if (sub.requestAccessTo(req, production)) {
        db.readOnlyConnection.query(`SELECT fileURL FROM episodes WHERE production = "${production}" AND seasonNumber = "${season}" AND episodeNumber = "${episode}";`, function (err, rows, fields) {
            return callback(rows[0].fileURL);
        });
    }
    else {
        return callback(null);
    }
};

var getAllFileUrls = function (req, production, callback) {

    if (sub.requestAccessTo(req, production)) {
        db.readOnlyConnection.query(`SELECT seasonNumber, episodeNumber, fileURL FROM episodes WHERE production = "${production}" ORDER BY seasonNumber, episodeNumber;`, function (err, rows, fields) {
            var fileUrls = [[]];
            var season = 0;
            fileUrls.push(['']); //push an empty placeholder, as index [0][n] will not be used

            rows.forEach(function (row) {
                if (season !== row.seasonNumber) {
                    fileUrls.push(['']);//push an empty placeholder, as index [n][0] will not be used
                    season += 1;
                }

                fileUrls[season].push(row.fileURL);
            });

            return callback(fileUrls);
        });
    }
    else {
        return callback(null);
    }
};


exports = module.exports = {getFileUrlFor, getAllFileUrls};
