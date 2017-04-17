var utils = require('../utils/utils');
var jwt = require('jwt-simple');

var model = require('seraph-model');
var confDB = require('../config/db')
var db = require('seraph')({
    server: confDB.db.server,
    user: confDB.db.user,
    pass: confDB.db.pass
});

/**
 * Devuelve aquello usuarios de la aplicación cuyo username sea similar
 * a un string enviado
 *
 * @param req
 * @param res
 */
module.exports.findUsuario = function (req, res) {

}

/**
 * Devuelve aquello contactos del usuario cuyo username sea similar
 * a un string enviado
 *
 * @param req
 * @param res
 */
module.exports.findEntreContactos = function (req, res) {


}

/**
 * Devuelve todos los contactos del usuario
 *
 * @param req
 * @param res
 */
module.exports.findMisContactos = function (req, res) {


}



