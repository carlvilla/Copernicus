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
 * Devuelve para el usuario que realizó la consulta, todos los usuarios existentes exceptuandose
 * aquellos bloqueados, los que lo tienen bloqueado, los que ya son contactos, a los que se envió solicitud de contacto
 * y a él mismo
 *
 * @param req
 * @param res
 */
module.exports.findPosiblesContactos = function (req, res) {

    var username = utils.getUsername(req);

    var query = "MATCH (u1:Usuario { username:'" + username + "' }), (u2:Usuario) where not (u1)-[]-(u2) " +
        "AND u1.username<>u2.username RETURN u2";

    db.query(query, function (err, result) {
        if (err) {
            //Error en el servidor
            utils.sendJSONresponse(res, 500, err);
        }
        else if (result.length > 0) {
            utils.sendJSONresponse(res, 200, result);
        }
        else {
            utils.sendJSONresponse(res, 204, "");
        }
    });

}

/**
 * Devuelve todos los contactos del usuario
 *
 * @param req
 * @param res
 */
module.exports.findMisContactos = function (req, res) {

    var username = utils.getUsername(req);

    var query = "MATCH (u1:Usuario { username: '" + username + "' })-[:Contacto]-(u2:Usuario) RETURN u2"

    db.query(query, function (err, result) {
        if (err) {
            //Error en el servidor
            utils.sendJSONresponse(res, 500, err);
        }
        else if (result.length > 0) {
            result.forEach(function (persona) {
                //No queremos mostrar información sobre las credenciales del usuario o el id de la BD, por ello los
                //eliminamos antes de enviarlos al cliente
                delete persona.hash;
                delete persona.salt;
                delete persona.id;
            });
            utils.sendJSONresponse(res, 200, result);
        }
        else {
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
module.exports.findSolicitudesContacto = function (req, res) {

    var username = utils.getUsername(req);

    var query = "MATCH (contacto:Usuario)-[solicitud:SolicitudContacto]->(u2:Usuario { username: '" + username + "' }) " +
        "RETURN contacto,solicitud"

    db.query(query, function (err, result) {
        if (err) {
            //Error en el servidor
            utils.sendJSONresponse(res, 500, err);
        }
        else if (result.length > 0) {
            utils.sendJSONresponse(res, 200, result);
        }
        else {
            utils.sendJSONresponse(res, 204, "");
        }
    });
}

/**
 * Establece una relación de tipo SolicitudContacto entre los usuarios pasados con un atributo mensaje
 *
 * @param req
 * @param res
 */
module.exports.enviarSolicitudContacto = function (req, res) {

    var usernameEnvia = utils.getUsername(req);

    var usernameRecibe = req.body.username;

    var mensaje = req.body.mensaje;

    var query = "MATCH (u1:Usuario {username: '" + usernameEnvia + "'}), (u2:Usuario { username: '" + usernameRecibe + "' }) " +
        "create (u1)-[:SolicitudContacto{mensaje:'" + mensaje + "'}]->(u2)";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);

        } else {
            utils.sendJSONresponse(res, 204, "");
        }
    });

}

/**
 * Establece una relación de tipo Contacto y elimina la relación de tipo Solicitud Contacto. Se utiliza cuando se acepta
 * una solicitud de contacto
 *
 * @param req
 * @param res
 */
module.exports.aceptarSolicitudContacto = function (req, res) {

    var usernameAceptaSolicitud = utils.getUsername(req);

    var usernameEnvioSolicitud = req.body.usernameAceptado;

    console.log("Fue aceptado/a: " + usernameEnvioSolicitud + " por " + usernameAceptaSolicitud);

    //Eliminar solicitud
    var queryEliminarSolicitud = "MATCH (u1:Usuario {username:'" + usernameAceptaSolicitud + "'})" +
        "-[solicitud:SolicitudContacto]-(u2:Usuario {username: '" + usernameEnvioSolicitud + "'}) " +
        "with solicitud, solicitud.mensaje as mensaje delete solicitud return mensaje";

    //Crear relación de Contacto
    var queryAddContacto = "MATCH (u1:Usuario {username:'" + usernameAceptaSolicitud + "'})," +
        "(u2:Usuario {username: '" + usernameEnvioSolicitud + "'}) CREATE (u1)-[:Contacto]->(u2)";


    db.query(queryEliminarSolicitud, function (err, resultEliminarSolicitud) {
        if (err) {
            //Error en el servidor
            console.log("Error al eliminar la solicitud de contacto entre los usuarios " + usernameAceptaSolicitud +
                " y " + usernameEnvioSolicitud + ", ha ocurrido el siguiente error " + err);
            utils.sendJSONresponse(res, 500, err);
        }
        else {
            //Si no hubo ningún error se crea una relación de contacto entre los usuarios
            db.query(queryAddContacto, function (err, resultAddContacto) {
                if (err) {
                    //Error en el servidor
                    console.log("Error al crear la relación de contacto entre los usuarios " + usernameAceptaSolicitud +
                        " y " + usernameEnvioSolicitud + ", ha ocurrido el siguiente error: " + err);

                    //En el caso de que no se pudo crear la relación de contacto, pero si se borró la solicitud,
                    //se vuelve a crear la solicitud
                    var queryCrearSolicitud = "MATCH (u1:Usuario {username: '" + usernameEnvioSolicitud + "'})," +
                        " (u2:Usuario { username: '" + usernameAceptaSolicitud + "' })" +
                        "create (u1)-[:SolicitudContacto{mensaje:'" + resultEliminarSolicitud.mensaje + "'}]->(u2)";


                    db.query(queryCrearSolicitud, function (err, resultCrearSolicitud) {
                        if (err) {
                            console.log("Error al crear solicitud de contacto entre " + usernameEnvioSolicitud + " y "
                                + usernameAceptaSolicitud + ", ha ocurrido el siguiente error: " + err);
                            utils.sendJSONresponse(res, 500, err);
                        }
                    });
                    utils.sendJSONresponse(res, 500, err);

                } else {
                    utils.sendJSONresponse(res, 204, "");
                }
            });
        }
    });
}

/**
 * Elimina la relación de tipo Solicitud Contacto. Se utiliza cuando se ignora una solicitud de contacto.
 *
 * @param req
 * @param res
 */
module.exports.ignorarSolicitudContacto = function (req, res) {

    var usernameIgnoraSolicitud = utils.getUsername(req);

    var usernameEnvioSolicitud = req.body.usernameIgnorado;

    console.log("Fue ignorado/a: " + usernameEnvioSolicitud + " por " + usernameIgnoraSolicitud);

    //Eliminar solicitud
    var queryEliminarSolicitud = "MATCH (u1:Usuario {username:'" + usernameIgnoraSolicitud + "'})" +
        "-[solicitud:SolicitudContacto]-(u2:Usuario {username: '" + usernameEnvioSolicitud + "'}) " +
        "delete solicitud";

    db.query(queryEliminarSolicitud, function (err, result) {
        if (err) {
            //Error en el servidor
            console.log("Error al eliminar la solicitud de contacto entre los usuarios " + usernameAceptaSolicitud +
                " y " + usernameEnvioSolicitud + ", ha ocurrido el siguiente error " + err);
            utils.sendJSONresponse(res, 500, err);
        }
        else {
            utils.sendJSONresponse(res, 204, "");
        }
    });
}



