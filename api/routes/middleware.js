var utils = require('../utils/utils');

var confDB = require('../config/db')
var db = require('seraph')({
    server: confDB.db.server,
    user: confDB.db.user,
    pass: confDB.db.pass
});

module.exports.checkAdminOrModerador = function (req, res, next) {
    var idSala = req.body.idSala;
    var username = utils.getUsername(req);

    var query = "MATCH(u:Usuario{username:'" + username + "'})-[r:Moderador | Admin]->(s:Sala{idSala:" + idSala + "})" +
        "RETURN  r";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if(result[0]){
                next();
            }else{
                utils.sendJSONresponse(res, 500, err);
            }
        }
    });
}


module.exports.checkAdmin = function (req, res, next) {
    var idSala = req.body.idSala;
    var username = utils.getUsername(req);

    var query = "MATCH(u:Usuario{username:'" + username + "'})-[r:Admin]->(s:Sala{idSala:" + idSala + "})" +
        "RETURN  r";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if(result[0]){
                next();
            }else{
                utils.sendJSONresponse(res, 500, err);
            }
        }
    });
}

