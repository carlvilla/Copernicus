var passport = require('passport');
require('../utils/passport');

var utils = require('../utils/utils');
var jwt = require('jwt-simple');
var cloudinary = require('cloudinary');

var model = require('seraph-model');
var confDB = require('../config/db')
var db = require('seraph')({
    server: confDB.db.server,
    user: confDB.db.user,
    pass: confDB.db.pass
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});

var user = model(db, 'Usuario');
var emailRegex = /([a-z0-9][-a-z0-9_\+\.]*[a-z0-9])@([a-z0-9][-a-z0-9\.]*[a-z0-9]\.(arpa|root|aero|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)|([0-9]{1,3}\.{3}[0-9]{1,3}))/;
user.schema = {
    username: {type: String, required: true},
    nombre: {type: String, required: true},
    apellidos: {type: String},
    email: {type: String, match: emailRegex, required: true},
    hash: {type: String},
    salt: {type: String}
};

/**
 * Comprueba que las credenciales enviadas por el usuario son correctas. En el caso de serlo, se envía un token que
 * lo identifica y que le permite el acceso sin volver a introducir los credenciales durante cierto tiempo.
 *
 * @param req
 * @param res
 */
module.exports.login = function (req, res) {
    if (!req.body.username || !req.body.password) {
        utils.sendJSONresponse(res, 400, {
            "message": "Todos los campos son obligatorios"
        });
    } else {
        passport.authenticate('local', function (err, usuario, info) {
            var token;
            if (err) {
                console.log(err);
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

/**
 * Registra a un nuevo usuario, creando un nuevo nodo de tipo 'Usuario' en el que se almacena los datos enviados.
 * En el caso de la contraseña, se crea una hash y una salt a partir de ella, y se almacenan estos en vez de
 * la contraseña.
 *
 * @param req
 * @param res
 */
module.exports.register = function (req, res) {

    if (!req.body.username || !req.body.nombre || !req.body.email || !req.body.password) {
        utils.sendJSONresponse(res, 400, {
            "message": "Faltan campos obligatorios"
        });

        return;
    }

    var username = req.body.username;
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var email = req.body.email;
    var credenciales = utils.setPassword(req.body.password);
    var fotoPerfil = req.body.fotoPerfil;
    var fotoPorDefecto = req.body.fotoPorDefecto;

    //Comprueba que el nombre de usuario no esté en uso
    var predicate = {username: username};

    user.where(predicate, function (err, people) {
        if (err) throw err;
        if (!people.length == 0) {
            utils.sendJSONresponse(res, 403, "");
        } else {
            cloudinary.uploader.upload(fotoPerfil, function (result) {

                if (fotoPorDefecto)
                    fotoPerfil = 'https://res.cloudinary.com/videoconference/image/upload/v1496079819/profile.jpg'
                else
                    fotoPerfil = result.secure_url;


                user.save({
                    username: username,
                    nombre: nombre,
                    apellidos: apellidos,
                    email: email,
                    foto: fotoPerfil,
                    hash: credenciales.hash,
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

            //No queremos mostrar información sobre las credenciales del usuario o el id de la BD, por ello los
            //eliminamos antes de enviarlos al cliente
            delete people[0].hash;
            delete people[0].salt;
            delete people[0].id;

            utils.sendJSONresponse(res, 200, people);
        }
    });
};

module.exports.profile = function (req, res) {

    var token = req.cookies.token;

    var payload = jwt.decode(token, process.env.JWT_SECRET);

    var predicate = {username: payload.sub.username};

    user.where(predicate, function (err, people) {
        if (err) throw err;
        if (people.length == 0) {
            utils.sendJSONresponse(res, 204, '');
        } else {

            //No queremos mostrar información sobre las credenciales del usuario o el id de la BD, por ello los
            //eliminamos antes de enviarlos al cliente
            delete people[0].hash;
            delete people[0].salt;
            delete people[0].id;

            utils.sendJSONresponse(res, 200, people);
        }
    });

};

/**
 * Devuelve los usuarios que tiene bloqueados el usuario que manda la petición
 *
 * @param req
 * @param res
 */
module.exports.bloqueados = function (req, res) {
    var username = utils.getUsername(req);

    var query = "MATCH(u:Usuario{username:'" + username + "'})-[:Bloqueado]->(uB:Usuario) RETURN uB"

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            //Eliminamos datos sensibles, que no deseamos que otros usuarios puedan obtener.
            result.forEach(function (person) {
                delete person.hash;
                delete person.salt;
                delete person.id;
            });

            utils.sendJSONresponse(res, 200, result);
        }
    });

};

/**
 * Crea una relación 'Bloqueado' entre el usuario que realiza la petición y el usuario cuyo username es enviado. También
 * elimina la relación 'Contacto' que existía entre los usuarios y expulsa al usuario bloqueado de todas aquellas salas
 * en las que el usuario que envió la petición es 'Admin'
 *
 * @param req
 * @param res
 */
module.exports.bloquear = function (req, res) {

    var username = utils.getUsername(req);

    var usernameBloqueado = req.body.username;

    var queryAddBloqueado = "MATCH(u:Usuario{username:'" + username + "'}),(uB:Usuario{username:'" + usernameBloqueado + "'}) " +
        "CREATE (u)-[:Bloqueado]->(uB)"

    db.query(queryAddBloqueado, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {

            var queryRemoveContacto = "MATCH(u:Usuario{username:'" + username + "'})-[c:Contacto]-(uB:Usuario{username:'"
                + usernameBloqueado + "'}) DELETE c"

            db.query(queryRemoveContacto, function (err, result) {
                if (err) {
                    utils.sendJSONresponse(res, 500, err);
                } else {

                    var queryFindAdmin = "MATCH(u:Usuario{username:'" + username + "'})," +
                        "(uB:Usuario{username:'" + usernameBloqueado + "'}),(s:Sala) where (u)-[:Admin]->(s) " +
                        "AND (uB)-[:Miembro | Moderador]-(s) RETURN s";

                    var queryRemoveMiembro = "MATCH(u:Usuario{username:'" + usernameBloqueado + "'})" +
                        "-[r:Miembro | Moderador]->(sala:Sala) DELETE r RETURN sala";

                    db.query(queryFindAdmin, function (err, result) {
                        if (err) {
                            utils.sendJSONresponse(res, 500, err);
                        } else {

                            result.forEach(function (sala) {
                                db.query(queryRemoveMiembro, function (err, result) {
                                });
                            });

                            utils.sendJSONresponse(res, 204, result);

                        }

                    });
                }


            });


        }
    });

}

/**
 * Elimina la relación "Bloqueado" entre los usuarios y vuelve a establecer la relación "Contacto"
 *
 * @param req
 * @param res
 */
module.exports.desbloquear = function (req, res) {
    var username = utils.getUsername(req);
    var usernameBloqueado = req.body.username;

    var queryEliminaBloqueo = "MATCH(u:Usuario{username:'" + username + "'})-[r:Bloqueado]->" +
        "(uB:Usuario{username: '" + usernameBloqueado + "'}) DELETE r"

    db.query(queryEliminaBloqueo, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {

            var queryContacto = "MATCH(u1:Usuario{username:'" + username + "'})," +
                " (u2:Usuario{username: '" + usernameBloqueado + "'}) CREATE (u1)-[:Contacto]->(u2)"

            db.query(queryContacto, function (err, result) {
                if (err) {
                    utils.sendJSONresponse(res, 500, err);
                } else {
                    utils.sendJSONresponse(res, 204, '');
                }
            })


        }
    });
};

/**
 *
 *
 * @param req
 * @param res
 */
module.exports.datosUsuario = function (req, res) {

    var username = req.body.username;

    var query = "MATCH(u:Usuario{username:'" + username + "'}) RETURN u";

    db.query(query, function (err, result) {
            if (err) {
                utils.sendJSONresponse(res, 500, err);
            } else {
                //Eliminamos datos sensibles, que no deseamos que otros usuarios puedan obtener.
                delete result[0].hash;
                delete result[0].salt;
                delete result[0].id;

                utils.sendJSONresponse(res, 200, result[0]);
            }
        }
    );
};

/**
 * Modificar contraseña del usuario
 *
 * @param req
 * @param res
 */
module.exports.modificarPass = function (req, res) {

    var username = utils.getUsername(req);

    passport.authenticate('local', function (err, usuario, info) {
        var token;
        if (err) {
            utils.sendJSONresponse(res, 404, "pass");
            return;
        }

        if (usuario) {
            var credenciales = utils.setPassword(req.body.passwordNueva);
            var query = "MATCH(u:Usuario{username:'" + username + "'}) SET u.hash = '"
                + credenciales.hash + "', u.salt = '" + credenciales.salt + "'";

            db.query(query, function (err, result) {
                if (err) {
                    utils.sendJSONresponse(res, 500, "pass");
                } else {
                    utils.sendJSONresponse(res, 204, "");
                }
            });

        } else {
            utils.sendJSONresponse(res, 401, "pass");
        }

    })(req, res);

}

/**
 * Modificar datos del usuario
 *
 * @param req
 * @param res
 */
module.exports.modificarDatos = function (req, res) {

    var username = utils.getUsername(req);
    var usuario = req.body.usuario;
    var nombre = usuario.nombre;
    var apellidos = usuario.apellidos;
    var email = usuario.email;
    var fotoCambiada = req.body.fotoCambiada;
    var foto = req.body.foto;

    if (!nombre) {
        utils.sendJSONresponse(res, 500, "nombre");
        return;
    } else if (apellidos && apellidos.length > 35) {
        utils.sendJSONresponse(res, 500, "apellidos");
        return;
    } else if (!email.match(emailRegex)) {
        utils.sendJSONresponse(res, 500, "email");
        return;
    }

    var ejecutarQuery = function (query) {
        db.query(query, function (err, result) {
            if (err) {
                utils.sendJSONresponse(res, 500, err);
            } else {
                utils.sendJSONresponse(res, 204, "");
            }
        });
    }

    if (fotoCambiada) {
        //Si la foto se modificó, cambiamos la url de la foto de la sala
        cloudinary.uploader.upload(foto, function (result) {
            var query = "MATCH(u:Usuario{username:'" + username + "'}) SET u.nombre = '" + nombre + "', u.apellidos = '"
                + apellidos + "', u.email = '" + email + "', u.foto = '" + result.secure_url + "'";
            ejecutarQuery(query);
        });
    } else {
        //Si la foto no se modificó, solo cambiamos el nombre y descripción de la sala
        var query = "MATCH(u:Usuario{username:'" + username + "'}) SET u.nombre = '" + nombre + "', u.apellidos = '"
            + apellidos + "', u.email = '" + email + "'";

        ejecutarQuery(query);
    }
}

/**
 * Eliminar la cuenta del usuario. Esto implica eliminar todas las salas en las que es administrador y sus relaciones,
 * y todas las relaciones que tiene con otros usuario o salas
 *
 * @param req
 * @param res
 */
module.exports.eliminarCuenta = function (req, res) {
    var username = utils.getUsername(req);

    //Eliminar salas Admin con relaciones
    var queryAdmin = "MATCH (u:Usuario{username:'" + username + "'})-[r:Admin]->(s:Sala)-[rs]-(Usuario) DELETE rs, r, s";

    db.query(queryAdmin, function (err, result) {
        if (err) {
            console.log(err);
            utils.sendJSONresponse(res, 500, "cuenta");
        } else {
            var queryUsuario = "MATCH (u:Usuario{username:'" + username + "'})-[r]-() DELETE r, u";

            db.query(queryUsuario, function (err, result) {
                if (err) {
                    utils.sendJSONresponse(res, 500, "cuenta");
                } else {
                    utils.sendJSONresponse(res, 204, '');
                }
            })
        }
    })

};
