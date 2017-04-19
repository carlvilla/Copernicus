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

/**
 * Devuelve para el usuario que realizó la consulta, todos los usuarios existentes exceptuandose
 * aquellos bloqueados, los que lo tienen bloqueado, los que ya son contactos, a los que se envió solicitud de contacto
 * y a él mismo
 *
 * @param req
 * @param res
 */
module.exports.findPosiblesContactos = function (req, res) {

    var username = utils.getUsername(req);

    var query = "MATCH (u1:Usuario { username:'"+username+"' }), (u2:Usuario) where not (u1)-[]-(u2) " +
        "AND u1.username<>u2.username RETURN u2";

    db.query(query, function(err, result) {
        if (err) {
            //Error en el servidor
            utils.sendJSONresponse(res, 500, err);
        }
        else if (result.length > 0) {
            //El usuario participa en alguna sala
            utils.sendJSONresponse(res, 200, result);
        }
        else {
            //El usuario no participa en ninguna sala
            utils.sendJSONresponse(res, 204, "");
        }
    });

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

    var username = utils.getUsername(req);

    var query = "MATCH (u1:Usuario { username: '"+username+"' })-[:Contacto]-(u2:Usuario) RETURN u2"

    db.query(query, function(err, result) {
        if (err) {
            //Error en el servidor
            utils.sendJSONresponse(res, 500, err);
        }
        else if (result.length > 0) {
            //El usuario participa en alguna sala
            utils.sendJSONresponse(res, 200, result);
        }
        else {
            //El usuario no participa en ninguna sala
            utils.sendJSONresponse(res, 204, "");
        }
    });

}

/**
 * Devuelve las solicitudes de contacto recibidas por el usuario
 *
 * @param req
 * @param res
 */
module.exports.findSolicitudesContacto = function(req, res){

    var username = utils.getUsername(req);

    var query = "MATCH (u1:Usuario)-[:SolicitudContacto]->(u2:Usuario { username: '"+username+"' }) RETURN u1"

    db.query(query, function(err, result) {
        if (err) {
            //Error en el servidor
            utils.sendJSONresponse(res, 500, err);
        }
        else if (result.length > 0) {
            //El usuario participa en alguna sala
            utils.sendJSONresponse(res, 200, result);
        }
        else {
            //El usuario no participa en ninguna sala
            utils.sendJSONresponse(res, 204, "");
        }
    });
}



