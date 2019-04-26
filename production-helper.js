var db = require('./db-helper.js');
var sub = require('./subscription-helper');

var getFileUrlFor = function (req, production, season, episode, callback) {
    sub.requestAccessTo(req, production, function (success) {
        if (success) {
            db.readOnlyConnection.query(`SELECT fileURL FROM episodes WHERE production = "${production}" AND seasonNumber = "${season}" AND episodeNumber = "${episode}";`, function (err, rows, fields) {
                if (err) throw err;
                return callback(rows[0].fileURL);
            });
        }
        else {
            return callback(null);
        }
    })

};

var getAllFileUrls = function (req, production, callback) {
    sub.requestAccessTo(req, production, function (success) {
        if (success) {
            db.readOnlyConnection.query(`SELECT seasonNumber, episodeNumber, title, fileURL FROM episodes WHERE production = "${production}" ORDER BY seasonNumber, episodeNumber;`, function (err, rows, fields) {
                if (err) throw err;
                var fileUrls = [[]];
                var season = 0;
                fileUrls.push(['']); //push an empty placeholder, as index [0][n] will not be used

                rows.forEach(function (row) {
                    if (season !== row.seasonNumber) {
                        fileUrls.push(['']);//push an empty placeholder, as index [n][0] will not be used
                        season += 1;
                    }

                    fileUrls[season].push({title: row.title, url:row.fileURL});
                });

                return callback(fileUrls);
            });
        }
        else {
            return callback(null);
        }
    })
};


exports = module.exports = {getFileUrlFor, getAllFileUrls};
