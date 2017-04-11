var passport = require('passport');
require('../utils/passport');

var utils = require('../utils/utils');
var jwt = require('jwt-simple');


var model = require('seraph-model');
var confDB = require('../config/db')
var db = require('seraph')({
    server: confDB.db.server,
    user: confDB.db.user,
    pass: confDB.db.pass
});

var user = model(db, 'Usuario');
var emailRegex = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
user.schema = {
    username: {type: String, required: true},
    nombre: {type: String, required: true},
    apellidos: {type: String, required: true},
    email: {type: String, match: emailRegex, required: true},
    hash: {type: String},
    salt: {type: String}
};

module.exports.login = function (req, res) {

    if (!req.body.username || !req.body.password) {
        utils.sendJSONresponse(res, 400, {
            "message": "Todos los campos son obligatorios"
        });
    } else {
        passport.authenticate('local', function (err, usuario, info) {
            var token;
            if (err) {
                utils.sendJSONresponse(res, 404, err);
                return;
            }

            if (usuario) {
                token = utils.generateJwt(usuario.username, usuario.nombre);
                utils.sendJSONresponse(res, 200, {
                    "token": token
                });
            } else {
                utils.sendJSONresponse(res, 401, info);
            }

        })(req, res);
    }
};

module.exports.register = function (req, res) {
    if (!req.body.username || !req.body.nombre || !req.body.apellidos || !req.body.email || !req.body.password) {
        utils.sendJSONresponse(res, 400, {
            "message": "Todos los campos son obligatorios"
        });
        return;
    }

    var username = req.body.username;
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var email = req.body.email;
    var credenciales = utils.setPassword(req.body.password);

    user.save({
        username: username, nombre: nombre, apellidos: apellidos, email: email, hash: credenciales.hash,
        salt: credenciales.salt
    }, function (err, node) {
        var token;
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            token = utils.generateJwt(username, nombre);
            utils.sendJSONresponse(res, 200, {
                "token": token,
                "username": username
            });
        }
    });
};

/**
 * Comprueba que el nombre de usuario no este ya asignado
 *
 * @param req
 * @param res
 */
module.exports.validarUsername = function (req, res) {

    var predicate = {username: req.params.username};

    user.where(predicate, function (err, people) {
        if (err) throw err;
        if (people.length == 0) {
            utils.sendJSONresponse(res, 204, "");
        } else {
            utils.sendJSONresponse(res, 200, people);
        }
    });
};

module.exports.profile = function (req, res) {

    console.log("Aqui");

    var token = req.cookies.token;

    var payload = jwt.decode(token, process.env.JWT_SECRET);

    var predicate = {username: payload.sub.username};

    user.where(predicate, function (err, people) {
        if (err) throw err;
        if (people.length == 0) {
            utils.sendJSONresponse(res, 204, "");
        } else {
            utils.sendJSONresponse(res, 200, people);
        }
    });

};

module.exports.users = function (req, res) {
};

module.exports.delete = function (req, res) {
};
