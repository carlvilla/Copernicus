var passport = require('passport');
var utils = require('../utils/utils');
var model = require("seraph-model");

var confDB = require('../config/db')
var seraph = require('seraph')({
    server: confDB.db.server,
    URI: confDB.db.URI,
    user: confDB.db.user,
    pass: confDB.db.pass});

var user = model(seraph, 'User');
require('../config/passport.js');

module.exports.login = function(req, res) {
    console.log("Login");

};

module.exports.register = function(req, res) {

    console.log("Registro");

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

    user.save({username: username, nombre: nombre, apellidos: apellidos, email: email, hash: credenciales.hash,
        salt: credenciales.salt},function(err, node) {
        var token;
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            token = utils.generateJwt(username, nombre);
            utils.sendJSONresponse(res, 200, {
                "token" : token
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
module.exports.validarUsername = function(req, res){

    console.log(confDB);
    console.log("Validar username");

    var predicate = { username: req.params.username };
    var usuario = seraph.find(predicate, function (err, people) {
        if (err) throw err;
        if (people.length == 0) {
            utils.sendJSONresponse(res, 204, "");
        }else{
            utils.sendJSONresponse(res, 200, people);
        }


        console.log(people);
    });
};


module.exports.profile = function(req, res) {
};

module.exports.users = function(req, res) {
};

module.exports.delete = function(req, res){
};
