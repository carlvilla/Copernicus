/**
 * @ngdoc function
 * @name copernicus.function:middleware
 *
 * @description
 * Proporciona métodos para realizar comprobaciones sobre las peticiones para decir si dejarlas continuar a
 * los controladores para que las gestionen.
 */

/**
 * @ngdoc property
 * @name utils
 * @propertyOf copernicus.function:middleware
 * @description
 * Referencia a 'Utils'
 *
 **/
var utils = require('../utils/utils');

/**
 * @ngdoc property
 * @name confDB
 * @propertyOf copernicus.function:middleware
 * @description
 * Referencia a 'DB'.
 *
 **/
var confDB = require('../config/db')

/**
 * @ngdoc property
 * @name db
 * @propertyOf copernicus.function:middleware
 * @description
 * Atributo utilizado para realizar consultas contra la base de datos. Es creado con el módulo 'seraph' utilizando la
 * configuración de la base de datos contenida en 'confDB'.
 *
 **/
var db = require('seraph')({
    server: confDB.db.server,
    user: confDB.db.user,
    pass: confDB.db.pass
});

/**
 * @ngdoc property
 * @name emailRegex
 * @propertyOf copernicus.function:middleware
 * @description
 * Contiene una expresión regular para comprobar la validez de los emails.
 *
 **/
var emailRegex = /([a-z0-9][-a-z0-9_\+\.]*[a-z0-9])@([a-z0-9][-a-z0-9\.]*[a-z0-9]\.(arpa|root|aero|biz|cat|com|me|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)|([0-9]{1,3}\.{3}[0-9]{1,3}))/;

/**
 * @ngdoc method
 * @name checkEmail
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que el formato de un email sea válido.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkEmail = function (req, res, next) {

    if (emailRegex.test(req.body.email)) {
        next();
    } else {
        utils.sendJSONresponse(res, 400, "email");
    }
}

/**
 * @ngdoc method
 * @name checkNombreApellidos
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que el nombre y apellidos sean válidos.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkNombreApellidos = function (req, res, next) {
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;

    if (nombre.length > 15 || nombre.length < 3) {
        utils.sendJSONresponse(res, 400, "nombre");
    } else if (apellidos.length > 35) {
        utils.sendJSONresponse(res, 400, "apellidos");
    } else {
        next();
    }
}

/**
 * @ngdoc method
 * @name usernameExiste
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que el nombre de usuario exista en la base de datos.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.usernameExiste = function (req, res, next) {
    var username = utils.getUsername(req);

    var query = "MATCH(u:Usuario{username: {username} }) return u";

    db.query(query, {username: username}, function (err, result) {
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
 * @ngdoc method
 * @name usernameNoExiste
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que el nombre de usuario no exista en la base de datos.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.usernameNoExiste = function (req, res, next) {
    var username = req.body.username;

    var query = "MATCH(u:Usuario{username:{username}}) return u";

    db.query(query, {username: username}, function (err, result) {
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
 * @ngdoc method
 * @name checkAdminOModerador
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que el usuario que envio la petición sea administrador o moderador de la sala.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkAdminOModerador = function (req, res, next) {
    var idSala = req.body.idSala;
    var username = utils.getUsername(req);

    var query = "MATCH(u:Usuario{username: {username} })-[r:Moderador | Admin]->(s:Sala{idSala:{idSala} })" +
        "RETURN  r";

    db.query(query, {username:username, idSala:idSala} ,function (err, result) {
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
 * @ngdoc method
 * @name checkAdminSiCambioAModerador
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que el usuario sea administrador si se intenta realizar un cambio a un participante que sea administrador.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkAdminSiCambioAModerador = function (req, res, next) {
    var idSala = req.body.idSala;
    var username = utils.getUsername(req);
    var usernamePermisosModificados = req.body.username;

    var query = "MATCH(u:Usuario{username:{usernamePermisosModificados}})-[r]-(s:Sala{idSala:{idSala}}) return r";

    db.query(query, {usernamePermisosModificados:usernamePermisosModificados, idSala:idSala} ,function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            if (!result[0]) {
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
 * @ngdoc method
 * @name checkAdmin
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que el usuario que envio la petición sea administrador de la sala.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkAdmin = function (req, res, next) {
    var idSala = req.body.idSala;
    var username = utils.getUsername(req);

    var query = "MATCH(u:Usuario{username:{username}})-[r:Admin]->(s:Sala{idSala:{idSala}}) RETURN  r";

    db.query(query,{username:username, idSala:idSala}, function (err, result) {
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
 * @ngdoc method
 * @name checkNoSonContactos
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que dos usuarios no son contactos.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkNoSonContactos = function (req, res, next) {

    var username = utils.getUsername(req);
    var username2 = req.body.username;

    var query = "MATCH(u:Usuario{username:{username}})-[c:SolicitudContacto | Contacto]-" +
        "(u2:Usuario{username:{username2}}) RETURN  c";

    db.query(query, {username:username, username2:username2} , function (err, result) {
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
 * @ngdoc method
 * @name checkSonContactos
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que dos usuarios no son contactos.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkSonContactos = function (req, res, next) {
    var username = utils.getUsername(req);
    var username2 = req.body.username;

    var query = "MATCH(u:Usuario{username:{username}})-[c:SolicitudContacto | Contacto]-" +
        "(u2:Usuario{username:{username2}}) RETURN  c";

    db.query(query, {username:username, username2:username2} ,function (err, result) {
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
 * @ngdoc method
 * @name checkUsernamesEnviados
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que los username enviados no sea vacios.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
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
 * @ngdoc method
 * @name usuarioNoCandidatoAdminModeradorOMiembro
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que el usuario no sea candidato a unirse a una sala o administrador, moderador o miembro de la misma.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.usuarioNoCandidatoAdminModeradorOMiembro = function (req, res, next) {
    var username = req.body.username;
    var idSala = req.body.idSala;

    if (username == undefined || idSala == undefined) {
        utils.sendJSONresponse(res, 400, err);
    } else {
        var query = "MATCH(u:Usuario{username:{username}})-[c:Candidato | Admin | Moderador | Miembro]-" +
            "(s:Sala{idSala:{idSala}}) RETURN  c";

        db.query(query, {username:username, idSala:idSala} ,function (err, result) {
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
 * @ngdoc method
 * @name usuarioNoAdminModeradorOMiembro
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que el usuario no sea administrador, moderador o miembro de cierta sala.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.usuarioNoAdminModeradorOMiembro = function (req, res, next) {
    var username = utils.getUsername(req);
    var idSala = req.body.idSala;

    if (username == undefined || idSala == undefined) {
        utils.sendJSONresponse(res, 400, err);
    } else {

        var query = "MATCH(u:Usuario{username:{username}})-[c:Admin | Moderador | Miembro]" +
            "-(s:Sala{idSala:{idSala}}) RETURN  c";

        db.query(query, {username:username, idSala:idSala} ,function (err, result) {
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
 * @ngdoc method
 * @name checkExisteSolicitudContacto
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que exista una solicitud de contacto entre dos usuarios.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkExisteSolicitudContacto = function (req, res, next) {
    var username = utils.getUsername(req);
    var usernameEnvioSolicitud = req.body.usernameAceptado;

    if (!usernameEnvioSolicitud) {
        usernameEnvioSolicitud = req.body.usernameIgnorado;
    }

    var query = "MATCH(u:Usuario{username:{username}})-[c:SolicitudContacto]-" +
        "(u2:Usuario{username:{usernameEnvioSolicitud}}) RETURN  c";

    db.query(query, {username:username, usernameEnvioSolicitud:usernameEnvioSolicitud} ,function (err, result) {
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
 * @ngdoc method
 * @name checkExisteSolicitudSala
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que exista una solicitud de salas (Candidato) entre el usuario y una sala.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkExisteSolicitudSala = function (req, res, next) {
    var username = req.body.username;

    if (!username) {
        username = utils.getUsername(req);
    }

    var idSala = req.body.idSala;

    var query = "MATCH(u:Usuario{username:{username}})-[c:Candidato]-(s:Sala{idSala:{idSala}}) RETURN  c";

    db.query(query, {username:username, idSala:idSala} ,function (err, result) {
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
 * @ngdoc method
 * @name checkLimiteSala
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que no existan 4 participantes en la sala.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkLimiteSala = function (req, res, next) {
    var idSala = req.body.idSala;

    var usuarios = req.body.usuarios;

    //Si se envió un listado de usuarios, significa que se está creando una sala
    if (usuarios) {
        if (usuarios.length > 3) {
            utils.sendJSONresponse(res, 400, "");
        } else {
            next();
        }

    }

    //Si no se envió un listado de usuarios, significa que se está enviando una
    //solicitud de unión a una sala a un usuario
    else {
        var query = "MATCH(s:Sala{idSala:{idSala}})-[c:Candidato | Admin | Moderador | Miembro]-(Usuario) RETURN  c";

        db.query(query, {idSala:idSala} ,function (err, result) {
            if (err) {
                utils.sendJSONresponse(res, 500, err);
            } else {
                if (result.length < 4) {
                    next();
                } else {
                    utils.sendJSONresponse(res, 400, err);
                }
            }
        });

    }
}

/**
 * @ngdoc method
 * @name checkNombreDescripcionSala
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que el nombre y descripción de la sala sean válidos.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkNombreDescripcionSala = function (req, res, next) {
    var sala = req.body.sala;

    if (!sala.nombre || sala.nombre.length > 50) {
        utils.sendJSONresponse(res, 400, "");

    } else if (sala.descripcion && sala.descripcion.length > 200) {
        utils.sendJSONresponse(res, 400, "");

    } else {
        next();
    }
}

/**
 * @ngdoc method
 * @name checkPosibleEliminar
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba que el nombre y descripción de la sala sean válidos.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkPosibleEliminar = function (req, res, next) {
    var idSala = req.body.idSala;

    var usernameEnvia = utils.getUsername(req);
    var username = req.body.username;

    //En el caso de que no se pase un usuario significa que es el usuario que envía la petición quien quiere
    // abandonar la sala. Puede hacerlo si este no es administrador.
    if (!username) {

        var query = "MATCH(u:Usuario{username:{usernameEnvia}})-[c]-(s:Sala{idSala:{idSala}}) RETURN  c";

        db.query(query, {usernameEnvia:usernameEnvia, idSala:idSala} ,function (err, result) {
            if (err) {
                utils.sendJSONresponse(res, 500, err);
            } else {
                if (!result[0]) {
                    utils.sendJSONresponse(res, 400, err);
                    return;
                } else {

                    //Si el usuario que envía la petición es administrador de la sala, puede realizar la operación
                    if (result[0].type != 'Admin') {
                        next();

                    } else {
                        utils.sendJSONresponse(res, 400, err);
                    }
                }
            }
        });

    } else {
        var query = "MATCH(u:Usuario{username:{usernameEnvia}})-[c]-(s:Sala{idSala:{idSala}}) RETURN  c";

        db.query(query, {usernameEnvia:usernameEnvia, idSala:idSala} , function (err, result) {
            if (err) {
                utils.sendJSONresponse(res, 500, err);
            } else {
                if (!result[0]) {
                    utils.sendJSONresponse(res, 400, err);
                    return;
                }

                //Si el usuario que envía la petición es administrador de la sala, puede realizar la operación
                if (result[0].type == 'Admin') {
                    next();

                    //Si el usuario que envía la petición es moderador de la sala, hay que comprobar que el usuario
                    //al que intenta eliminar sea miembro
                } else if (result[0] && result[0].type == 'Moderador') {

                    query = "MATCH(u:Usuario{username:{username}})-[c]-(s:Sala{idSala:{idSala}}) RETURN  c";

                    db.query(query, {username:username, idSala:idSala} ,function (err, result) {
                        if (err) {
                            utils.sendJSONresponse(res, 500, err);
                        } else {
                            if (result[0] && result[0].type == 'Miembro') {
                                next();
                            } else {
                                utils.sendJSONresponse(res, 400, err);
                            }
                        }
                    });

                } else {
                    utils.sendJSONresponse(res, 400, err);
                }
            }
        });
    }
}