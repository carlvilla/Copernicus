var utils = require('../utils/utils');

var confDB = require('../config/db')
var db = require('seraph')({
    server: confDB.db.server,
    user: confDB.db.user,
    pass: confDB.db.pass
});

var emailRegex = /([a-z0-9][-a-z0-9_\+\.]*[a-z0-9])@([a-z0-9][-a-z0-9\.]*[a-z0-9]\.(arpa|root|aero|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)|([0-9]{1,3}\.{3}[0-9]{1,3}))/;

/**
 * Comprueba que el formato del email sea correcto
 * @param req
 * @param res
 * @param next
 */
module.exports.checkEmail = function (req, res, next) {
    if(emailRegex.test(req.body.email)){
        next();
    }else{
        utils.sendJSONresponse(res, 400, "email");
    }
}



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
 * Comprueba que el nombre de usuario no exista
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.usernameNoExiste = function (req, res, next) {
    var username = req.body.username;

    var query = "MATCH(u:Usuario{username:'" + username + "'}) return u";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if (result[0]) {
                utils.sendJSONresponse(res, 403, err);
            } else {
                next();
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







