var passport = require('passport');
var utils = require('../utils/utils');
var model = require("seraph-model");

var confDB = require('../config/db')
var seraph = require('seraph')({
    URI: confDB.db.URI,
    user: confDB.db.user,
    pass: confDB.db.pass});

var User = model(seraph, 'User');
require('../config/passport.js');


module.exports.login = function(req, res) {
};

module.exports.register = function(req, res) {

    if (!req.body.username || !req.body.nombre || !req.body.apellidos || !req.body.email || !req.body.password) {
        utils.sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    var username = req.body.username;
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var email = req.body.email;
    //var password = user.setPassword(req.body.password);

    User.save({username: username, nombre: nombre, apellidos: apellidos, email: email},function(err, node) {
        var token;
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            //token = user.generateJwt();
            utils.sendJSONresponse(res, 200, {
            //    "token" : token
            });
        }
    });
};



module.exports.profile = function(req, res) {
};

module.exports.users = function(req, res) {
};

module.exports.delete = function(req, res){
};
