var utils = require('../utils/utils');

var confDB = require('../config/db')
var db = require('seraph')({
    server: confDB.db.server,
    user: confDB.db.user,
    pass: confDB.db.pass
});

/**
 * Comprueba que la base de datos esté activa
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.checkDatabase = function (req, res, next) {
    var query = "RETURN timestamp()";
    db.query(query, function (error, result) {
        if (err) {
            utils.sendJSONresponse(res, 503, "");
        } else {
            next();
        }
    });
};

/**
 * Comprueba que el nombre de usuario exista
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.usernameExiste = function (req, res, next) {
    var username = utils.getUsername(req);

    var query = "MATCH(u:Usuario{username:'" + username + "'}) return u";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if (result[0]) {
                next();
            } else {
                utils.sendJSONresponse(res, 400, err);
            }
        }
    });
}

/**
 * Comprueba que el usuario que envio la petición sea administrador o moderador de la sala
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.checkAdminOrModerador = function (req, res, next) {
    var idSala = req.body.idSala;
    var username = utils.getUsername(req);

    var query = "MATCH(u:Usuario{username:'" + username + "'})-[r:Moderador | Admin]->(s:Sala{idSala:" + idSala + "})" +
        "RETURN  r";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if (result[0]) {
                next();
            } else {
                utils.sendJSONresponse(res, 400, err);
            }
        }
    });
}


/**
 * Comprueba que el usuario sea administrador si se intenta realizar un cambio a un participante que sea administrador
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.checkAdminSiCambioAModerador = function (req, res, next) {
    var idSala = req.body.idSala;
    var username = utils.getUsername(req);
    var usernamePermisosModificados = req.body.username;

    var query = "MATCH(u:Usuario{username:'" + usernamePermisosModificados + "'})" +
        "-[r]-(s:Sala{idSala:" + idSala + "}) return r";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if(!result){
                utils.sendJSONresponse(res, 400, err);
                return;
            }

            if (result[0].type == 'Moderador') {

                query = "MATCH(u:Usuario{username:'" + username + "'})" +
                    "-[r]-(s:Sala{idSala:" + idSala + "}) return r";

                db.query(query, function (err, result) {
                    if (err) {
                        utils.sendJSONresponse(res, 500, err);
                    } else {
                        if (result[0].type == 'Admin') {
                            next();
                        } else {
                            utils.sendJSONresponse(res, 400, err);
                        }
                    }
                });
            } else {
                next();
            }
        }
    });
}


/**
 * Comprueba que el usuario que envio la petición sea administrador de la sala
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.checkAdmin = function (req, res, next) {
    var idSala = req.body.idSala;
    var username = utils.getUsername(req);

    var query = "MATCH(u:Usuario{username:'" + username + "'})-[r:Admin]->(s:Sala{idSala:" + idSala + "})" +
        "RETURN  r";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if (result[0]) {
                next();
            } else {
                utils.sendJSONresponse(res, 400, err);
            }
        }
    });
}

/**
 * Comprueba que dos usuarios no son contactos
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.checkNoSonContactos = function (req, res, next) {

    var username = utils.getUsername(req);
    var username2 = req.body.username;

    var query = "MATCH(u:Usuario{username:'" + username + "'})-[c:SolicitudContacto | Contacto]-(u2:Usuario{username:'" + username2 + "'})" +
        "RETURN  c";

    db.query(query, function (err, result) {

        console.log(result[0]);

        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if (result[0]) {
                utils.sendJSONresponse(res, 400, err);
            } else {
                next();
            }
        }
    });
}

/**
 * Comprueba que dos usuarios no son contactos
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.checkSonContactos = function (req, res, next) {
    var username = utils.getUsername(req);
    var username2 = req.body.username;

    var query = "MATCH(u:Usuario{username:'" + username + "'})-[c:SolicitudContacto | Contacto]-(u2:Usuario{username:'" + username2 + "'})" +
        "RETURN  c";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if (result[0]) {
                next();
            } else {
                utils.sendJSONresponse(res, 400, err);
            }
        }
    });
}


/**
 * Comprueba que los username enviados no sea vacios
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.checkUsernamesEnviados = function (req, res, next) {
    var username = utils.getUsername(req);
    var username2 = req.body.username;

    if (username == undefined || username2 == undefined) {
        utils.sendJSONresponse(res, 400, err);
    } else {
        next();
    }

}

/**
 * Comprueba que el usuario no sea candidato a unirse a una sala o administrador, moderador o miembro de la misma
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.usuarioNoCandidatoAdminModeradorOMiembro = function (req, res, next) {
    var username = req.body.username;
    var idSala = req.body.idSala;

    if (username == undefined || idSala == undefined) {
        utils.sendJSONresponse(res, 400, err);
    } else {
        var query = "MATCH(u:Usuario{username:'" + username + "'})-[c:Candidato | Admin | Moderador | Miembro]" +
            "-(s:Sala{idSala:" + idSala + "}) RETURN  c";

        db.query(query, function (err, result) {
            if (err) {
                utils.sendJSONresponse(res, 500, err);
            } else {
                if (result[0]) {
                    utils.sendJSONresponse(res, 400, err);
                } else {
                    next();
                }
            }
        });

    }
}

/**
 * Comprueba que el usuario no sea administrador, moderador o miembro de cierta sala
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.usuarioNoAdminModeradorOMiembro = function (req, res, next) {
    var username = utils.getUsername(req);
    var idSala = req.body.idSala;

    if (username == undefined || idSala == undefined) {
        utils.sendJSONresponse(res, 400, err);
    } else {

        var query = "MATCH(u:Usuario{username:'" + username + "'})-[c:Admin | Moderador | Miembro]" +
            "-(s:Sala{idSala:" + idSala + "}) RETURN  c";

        db.query(query, function (err, result) {
            if (err) {
                utils.sendJSONresponse(res, 500, err);
            } else {
                if (result[0]) {
                    utils.sendJSONresponse(res, 400, err);
                } else {
                    next();
                }
            }
        });

    }
}

/**
 * Comprueba que exista una solicitud de contacto entre dos usuarios
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.checkExisteSolicitudContacto = function (req, res, next) {
    var username = utils.getUsername(req);
    var usernameEnvioSolicitud = req.body.usernameAceptado;

    if (!usernameEnvioSolicitud) {
        usernameEnvioSolicitud = req.body.usernameIgnorado;
    }

    var query = "MATCH(u:Usuario{username:'" + username + "'})-[c:SolicitudContacto]" +
        "-(u2:Usuario{username:'" + usernameEnvioSolicitud + "'}) RETURN  c";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if (result[0]) {
                next();
            } else {
                utils.sendJSONresponse(res, 400, err);
            }
        }
    });
}


/**
 * Comprueba que exista una solicitud de salas (Candidato) entre el usuario y una sala
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.checkExisteSolicitudSala = function (req, res, next) {
    var username = req.body.username;

    if (!username) {
        username = utils.getUsername(req);
    }

    var idSala = req.body.idSala;

    var query = "MATCH(u:Usuario{username:'" + username + "'})-[c:Candidato]" +
        "-(s:Sala{idSala:" + idSala + "}) RETURN  c";

    console.log(query);

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if (result[0]) {
                next();
            } else {
                utils.sendJSONresponse(res, 400, err);
            }
        }
    });

}

/**
 * Comprueba que no existan 8 participantes en la sala
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.comprobarLimiteSala = function (req, res, next) {
    var idSala = req.body.idSala;

    var query = "MATCH(s:Sala{idSala:" + idSala + "})-[c:Candidato | Admin | Moderador | Miembro]" +
        "-(Usuario) RETURN  c";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if (result.length < 8) {
                next();
            } else {
                utils.sendJSONresponse(res, 400, err);
            }
        }
    });
}







