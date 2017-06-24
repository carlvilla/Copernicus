var passport = require('passport');
require('../utils/passport');

var utils = require('../utils/utils');
var jwt = require('jwt-simple');
var cloudinary = require('cloudinary');

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
                utils.sendJSONresponse(res, 500, err);
                return;
            }

            if (usuario) {
                token = utils.generateJwt(usuario.username, usuario.nombre);
                utils.sendJSONresponse(res, 200, {
                    "token": token
                });
            } else {
                utils.sendJSONresponse(res, 403, info);
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
module.exports.registrar = function (req, res) {

    if (!req.body.username || !req.body.nombre || !req.body.email || !req.body.password) {
        utils.sendJSONresponse(res, 400, {
            "message": "Faltan campos obligatorios"
        });

        return;
    }

    var username = req.body.username;
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos || "";
    var email = req.body.email;
    var credenciales = utils.setPassword(req.body.password);
    var fotoPerfil = req.body.foto;
    var fotoPorDefecto = req.body.fotoPorDefecto;

    cloudinary.uploader.upload(fotoPerfil, function (result) {

        if (fotoPorDefecto || (fotoPorDefecto == undefined && fotoPorDefecto == undefined))
            fotoPerfil = 'https://res.cloudinary.com/videoconference/image/upload/v1496079819/profile.jpg'
        else {
            fotoPerfil = result.secure_url;
        }

        var query = "CREATE(u:Usuario{username:'" + username + "', nombre:'" + nombre + "', " +
            "apellidos:'" + apellidos + "', email:'" + email + "', foto:'" + fotoPerfil + "', hash:'"
            + credenciales.hash + "', salt:'" + credenciales.salt + "'})";

        db.query(query, function (err, result) {
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


/**
 * Comprueba que el nombre de usuario no este ya asignado
 *
 * @param req
 * @param res
 */
module.exports.validarUsername = function (req, res) {

    var username = req.params.username;

    var query = "MATCH(u:Usuario{username:'" + username + "'}) return u";

    db.query(query, function (err, people) {
        if (err) {
            utils.sendJSONresponse(res, 500, "");
            return;
        }
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

/**
 * Devuelve la información (exceptuando su hash, salt e ID utilizado en la base de datos)
 * del usuario que realizó la petición
 *
 * @param req
 * @param res
 */
module.exports.perfil = function (req, res) {

    var username = utils.getUsername(req);

    var query = "MATCH(u:Usuario{username:'" + username + "'}) return u";

    db.query(query, function (err, people) {
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
 * Devuelve los datos de un usuario cuyo username es pasado en la petición
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
            utils.sendJSONresponse(res, 403, "pass");
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
            utils.sendJSONresponse(res, 403, "pass");
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
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var email = req.body.email;
    var fotoCambiada = req.body.fotoCambiada;
    var foto = req.body.foto;

    if (!nombre) {
        utils.sendJSONresponse(res, 400, "nombre");
        return;
    } else if (apellidos && apellidos.length > 35) {
        utils.sendJSONresponse(res, 400, "apellidos");
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
