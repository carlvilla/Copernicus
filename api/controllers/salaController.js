/**
 * @ngdoc function
 * @name copernicus.function:salaController
 *
 * @description
 * Encargado de procesar las peticiones relacionadas con las salas, recibidas por la API REST, realizando las
 * consultas necesarias contra la base de datos.
 */

/**
 * @ngdoc property
 * @name utils
 * @propertyOf copernicus.function:salaController
 * @description
 * Referencia a 'Utils'.
 *
 **/
var utils = require('../utils/utils');

/**
 * @ngdoc property
 * @name jwt
 * @propertyOf copernicus.function:salaController
 * @description
 * Módulo 'jwt'.
 *
 **/
var jwt = require('jwt-simple');

/**
 * @ngdoc property
 * @name cloudinary
 * @propertyOf copernicus.function:salaController
 * @description
 * Módulo 'cloudinary'.
 *
 **/
var cloudinary = require('cloudinary');

/**
 * @ngdoc property
 * @name confDB
 * @propertyOf copernicus.function:salaController
 * @description
 * Referencia a 'DB'.
 *
 **/
var confDB = require('../config/db');

/**
 * @ngdoc property
 * @name db
 * @propertyOf copernicus.function:salaController
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

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});

/**
 * @ngdoc method
 * @name crearSala
 * @methodOf copernicus.function:salaController
 * @description
 * Crea una sala con la información pasada y envía peticiones de unión a esta a los usuarios pasados en la petición.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.crearSala = function (req, res) {

    var username = utils.getUsername(req);
    var sala = req.body.sala;
    var descripcion = sala.descripcion || "";
    var fotoPorDefecto = sala.fotoPorDefecto;

    var foto;

    if (sala.nombre > 50) {
        utils.sendJSONresponse(res, 400, 'nombre');
        return;

    } else if (sala.descripcion > 200) {
        utils.sendJSONresponse(res, 400, 'descripcion');
        return;

    }

    cloudinary.uploader.upload(sala.foto, function (result) {

        if (fotoPorDefecto)
            foto = 'https://res.cloudinary.com/videoconference/image/upload/v1496244474/sala.jpg';
        else
            foto = result.secure_url;

        var usuarios = req.body.usuarios;

        var idSala;

        //Obtenemos el último idSala utilizado. Este id es necesario para identificar de forma unequivoca una sala
        var queryLastSalaID = "match(s:Sala) with s.idSala as id return id order by id desc limit 1";
        db.query(queryLastSalaID, function (err, result) {
            //Si no existe ninguna sala, se crea la primera con el id 1
            if (result[0] != null)
                idSala = parseInt(result[0].id) + 1;
            else
                idSala = 1;

            //Creamos la sala
            var querySala = "CREATE(s:Sala{idSala:{idSala}, nombre:{nombre}, descripcion:{descripcion}, foto:{foto}})";

            db.query(querySala, {idSala: idSala, nombre: sala.nombre, descripcion: descripcion, foto: foto}
                , function (err, result) {
                    if (err) {
                        //Error al crear la sala
                        utils.sendJSONresponse(res, 500, err);
                        return;
                    }
                    else {

                        //Relacionamos los usuarios elegidos con la sala con una la relación pasada en el atributo permiso del
                        //usuario
                        if (usuarios[0] && usuarios[0].username) {
                            var queryUsuario;
                            usuarios.forEach(function (usuario) {

                                queryUsuario = "MATCH(u:Usuario{ username:{username} }),(s:Sala{ idSala: {idSala} }) " +
                                    "CREATE(u)-[:Candidato{ permisos:{permisos} }]->(s)";

                                db.query(queryUsuario, {
                                    username: (usuario.username), idSala: idSala
                                    , permisos: usuario.permisos
                                }, function (err, result) {
                                    if (err) {
                                        utils.sendJSONresponse(res, 500, err);
                                    }
                                });

                            })
                        }

                        //Relacionamos el creador de la sala con la sala con una relación de tipo Admin
                        var queryAdmin = "MATCH(u:Usuario{username:{username}}),(s:Sala{idSala:{idSala}})" +
                            "CREATE(u)-[:Admin]->(s)";

                        db.query(queryAdmin, {username: username, idSala: idSala}, function (err, result) {
                            if (err) {
                                utils.sendJSONresponse(res, 500, err);
                            } else {
                                utils.sendJSONresponse(res, 204, "");
                            }
                        });
                    }
                });

        });
    });
}

/**
 * @ngdoc method
 * @name buscarSalasParticipa
 * @methodOf copernicus.function:salaController
 * @description
 * Busca las salas en las que el usuario es administrador a miembro.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.buscarSalasParticipa = function (req, res) {

    var username = utils.getUsername(req);

    var query = "MATCH (Usuario { username: {username} })-[:Miembro|Admin|Moderador]-(Sala) RETURN Sala"


    db.query(query, {username: username}, function (err, result) {
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
 * @ngdoc method
 * @name checkParticipante
 * @methodOf copernicus.function:salaController
 * @description
 * Comprueba que un usuario sea miembro, moderador o administrador de una sala concreta.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.checkParticipante = function (req, res) {

    var username = utils.getUsername(req);

    var idSala = req.body.idSala;

    var query = "MATCH (u:Usuario{username:{username}}),(s:Sala{idSala:{idSala}}) WHERE (u)-" +
        "[:Miembro | Admin | Moderador]->(s) RETURN s";


    db.query(query, {username: username, idSala: idSala}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else if (result.length == 1) {
            utils.sendJSONresponse(res, 200, result);
        } else {
            //El usuario no tiene permisos para acceder a esta sala
            utils.sendJSONresponse(res, 400, err);
        }
    });
}

/**
 * @ngdoc method
 * @name buscarSalasCandidato
 * @methodOf copernicus.function:salaController
 * @description
 * Busca las salas en las que el usuario es candidato. Esto es que
 * se ha enviado una solicitud al usuario a que se una a una sala,
 * pero todavía no la ha aceptado.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.buscarSalasCandidato = function (req, res) {

    var username = utils.getUsername(req);

    var query = "MATCH (u:Usuario{username:{username}}),(s:Sala) WHERE (u)-[:Candidato]->(s) return s";

    db.query(query, {username: username}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 200, result);
        }
    });

};

/**
 * @ngdoc method
 * @name buscarSalasAdmin
 * @methodOf copernicus.function:salaController
 * @description
 * Devuelve las salas en las que el usuario es administrador.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.buscarSalasAdmin = function (req, res) {

    var username = utils.getUsername(req);

    var query = "MATCH (u:Usuario{username:{username}}),(s:Sala)where (u)-[:Admin]->(s) return s";

    db.query(query, {username: username}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 200, result);
        }
    });


}

/**
 * @ngdoc method
 * @name buscarSalasModerador
 * @methodOf copernicus.function:salaController
 * @description
 * Devuelve las salas en las que el usuario es moderador.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.buscarSalasModerador = function (req, res) {
    var username = utils.getUsername(req);

    var query = "MATCH (u:Usuario{username:{username}}),(s:Sala)where (u)-[:Moderador]->(s) return s";

    db.query(query, {username: username}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 200, result);
        }
    });

}

/**
 * @ngdoc method
 * @name buscarSalasMiembro
 * @methodOf copernicus.function:salaController
 * @description
 * Devuelve las salas en las que el usuario es miembro. Esto es, que no es ni administrador ni moderador.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.buscarSalasMiembro = function (req, res) {
    var username = utils.getUsername(req);

    var query = "MATCH (u:Usuario{username:{username}}),(s:Sala)where (u)-[:Miembro]->(s) return s";

    db.query(query, {username: username}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 200, result);
        }
    });

}

/**
 * @ngdoc method
 * @name aceptarSolicitudSala
 * @methodOf copernicus.function:salaController
 * @description
 * Elimina la relación de candidato entre el usuario y sala y se crea una relación del tipo de los parámetros otorgados.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.aceptarSolicitudSala = function (req, res) {
    var username = utils.getUsername(req);
    var idSala = req.body.idSala;

    //Elimina la relación de candidato entre el usuario y sala, y devuelve los permisos que se han concedido
    //al usuario en la sala
    var queryBorrarCandidato = "MATCH(u:Usuario{username:{username}})-[c:Candidato]->(s:Sala{idSala:{idSala}}) " +
        "WITH c as candidato, c.permisos as permisos DELETE candidato RETURN permisos"

    db.query(queryBorrarCandidato, {username: username, idSala: idSala}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            var permisos = result[0].permisos;

            //Relaciona el usuario con la sala utilizando los permisos que se le concedieron (Moderador o Miembro)
            var queryAddUsuario = "MATCH(u:Usuario{username:{username}}),(s:Sala{idSala:{idSala}}) " +
                "CREATE(u)-[:" + permisos + "]->(s)";

            db.query(queryAddUsuario, {username: username, idSala: idSala}, function (err, result) {
                if (err) {
                    utils.sendJSONresponse(res, 500, err);
                } else {
                    utils.sendJSONresponse(res, 200, result);
                }
            });
        }
    });
}

/**
 * @ngdoc method
 * @name ignorarSolicitudSala
 * @methodOf copernicus.function:salaController
 * @description
 * Elimina la relación de candidato entre el usuario y sala. Si se envía un nombre de usuario en la petición, se
 * eliminará la relación 'Candidato' entre ese usuario y la sala pasado. Si no es así, se eliminará la relación
 * entre el usuario que envió la solicitud y la sala enviada.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.ignorarSolicitudSala = function (req, res) {

    var username = req.body.username;

    if (!username) {
        username = utils.getUsername(req);
    }

    var idSala = req.body.idSala;

    var query = "MATCH(u:Usuario{username:{username}})-[c:Candidato]->(s:Sala{idSala:{idSala}}) DELETE c"

    db.query(query, {username: username, idSala: idSala}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 204, "");
        }
    });

}

/**
 * @ngdoc method
 * @name buscarParticipantesSala
 * @methodOf copernicus.function:salaController
 * @description
 * Devuelve los participantes de una sala (Miembros, Admin y Moderadores)
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.buscarParticipantesSala = function (req, res) {

    var idSala = req.body.idSala;

    var query = "MATCH(user:Usuario)-[rel:Miembro | Admin | Moderador]->(s:Sala{idSala:{idSala}}) " +
        "RETURN user,rel"

    db.query(query, {idSala: idSala}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            //Eliminamos datos sensibles, que no deseamos que otros usuarios puedan obtener.
            result.forEach(function (person) {
                delete person.user.hash;
                delete person.user.salt;
                delete person.user.id;
                person.user.permisos = person.rel.type;
                delete person.rel;
            });
            utils.sendJSONresponse(res, 200, result);
        }
    });
};

/**
 * @ngdoc method
 * @name actualizarDatos
 * @methodOf copernicus.function:salaController
 * @description
 * Actualiza los datos de la sala.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.actualizarDatos = function (req, res) {
    var idSala = req.body.idSala;
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var fotoCambiada = req.body.fotoCambiada;
    var foto = req.body.foto;

    if (nombre == '') {
        utils.sendJSONresponse(res, 400, 'nombre');
        return;
    }


    if (fotoCambiada) {
        //Si la foto se modificó, cambiamos la url de la foto de la sala
        cloudinary.uploader.upload(foto, function (result) {
            var query = "MATCH(s:Sala{idSala:{idSala}}) SET s.nombre = {nombre}, s.descripcion = {descripcion}," +
                " s.foto = {foto}";

            db.query(query, {
                idSala: idSala,
                nombre: nombre,
                descripcion: descripcion,
                foto: result.secure_url
            }, function (err, result) {
                if (err) {
                    utils.sendJSONresponse(res, 500, err);
                } else {
                    utils.sendJSONresponse(res, 204, "");
                }
            });


        });
    } else {
        //Si la foto no se modificó, solo cambiamos el nombre y descripción de la sala
        var query = "MATCH(s:Sala{idSala:{idSala}}) SET s.nombre = {nombre}, s.descripcion = {descripcion}";

        db.query(query, {
            idSala: idSala,
            nombre: nombre,
            descripcion: descripcion,
        }, function (err, result) {
            if (err) {
                utils.sendJSONresponse(res, 500, err);
            } else {
                utils.sendJSONresponse(res, 204, "");
            }
        });

    }


}

/**
 * @ngdoc method
 * @name eliminarUsuario
 * @methodOf copernicus.function:salaController
 * @description
 * Elimina la relación entre el usuario y la sala especificados.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.eliminarUsuario = function (req, res) {

    var idSala = req.body.idSala;
    var username = req.body.username;

    //En el caso de que no se pase un usuario significa que es el usuario que envía la petición cuya
    //relación con la sala debe de ser eliminada
    if (!username) {
        username = utils.getUsername(req);
    }

    console.log(idSala);

    console.log(username);

    var query = "MATCH(Sala{idSala:{idSala}})-[r]-(Usuario{username:{username}}) DELETE r";

    db.query(query, {idSala: idSala, username: username}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 204, "");
        }
    });
}

/**
 * @ngdoc method
 * @name eliminarSala
 * @methodOf copernicus.function:salaController
 * @description
 * Elimina la sala cuyo ID es pasado como parámetro.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.eliminarSala = function (req, res) {
    var idSala = req.body.idSala;

    var query = "OPTIONAL MATCH()-[r]->(s:Sala{idSala:{idSala}}) delete r,s";

    db.query(query, {idSala: idSala}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 204, "");
        }
    });
}

/**
 * @ngdoc method
 * @name cambiarPermisos
 * @methodOf copernicus.function:salaController
 * @description
 * Cambia los permisos de un determinado usuario que participa en una sala.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.cambiarPermisos = function (req, res) {
    var idSala = req.body.idSala;
    var username = req.body.username;
    var permisos = req.body.permisos;

    //No es posible introducir los permisos introduciendo el valor de la variable al ejecutar la consulta, ya que
    //es el nombre de una relación. Esto no implica un problema ya que el usuario no introduce ese valor sino que lo
    //selecciona.
    var query = "MATCH(u:Usuario{username:{username}})-[r]->(s:Sala{idSala:{idSala}}) " +
        "CREATE (u)-[r2:" + permisos + "]->(s) DELETE r";

    db.query(query, {username: username, idSala: idSala}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 204, "");
        }
    });
}

/**
 * @ngdoc method
 * @name cambiarPermisosSolicitud
 * @methodOf copernicus.function:salaController
 * @description
 * Cambia los permisos de una petición para unirse a una sala
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.cambiarPermisosSolicitud = function (req, res) {
    var idSala = req.body.idSala;
    var username = req.body.username;
    var permisos = req.body.permisos;

    var query = "MATCH(u:Usuario{username:{username}})-[r]->(s:Sala{idSala:{idSala}}) " +
        "CREATE (u)-[r2:Candidato{permisos:{permisos}}]->(s) DELETE r";

    db.query(query, {username: username, idSala: idSala, permisos: permisos}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 204, "");
        }
    });
}

/**
 * @ngdoc method
 * @name enviarSolicitudSala
 * @methodOf copernicus.function:salaController
 * @description
 * Crea una relación 'Candidato' entre un usuario y una sala, estableciendo una propiedad 'permisos'
 * con valor 'Miembro'.
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.enviarSolicitudSala = function (req, res) {
    var idSala = req.body.idSala;
    var username = req.body.username;

    var query = "MATCH(u:Usuario{username:{username}}),(s:Sala{idSala:{idSala}}) " +
        "CREATE(u)-[:Candidato{permisos:'Miembro'}]->(s)";

    db.query(query, {username: username, idSala: idSala}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 204, "");
        }
    });
};

/**
 * @ngdoc method
 * @name buscarCandidatos
 * @methodOf copernicus.function:salaController
 * @description
 * Devuelve los participantes de una sala (Miembros, Admin y Moderadores).
 *
 * @param {object} req Objeto de solicitud
 * @param {object} res Objeto de respuesta
 *
 **/
module.exports.buscarCandidatos = function (req, res) {

    var idSala = req.body.idSala;

    var query = "MATCH(user:Usuario)-[rel:Candidato]->(s:Sala{idSala:{idSala}}) RETURN user,rel"

    db.query(query, {idSala:idSala}, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            //Eliminamos datos sensibles, que no deseamos que otros usuarios puedan obtener.
            result.forEach(function (person) {
                delete person.user.hash;
                delete person.user.salt;
                delete person.user.id;
                person.user.permisos = person.rel.type;
            });
            utils.sendJSONresponse(res, 200, result);
        }
    });
};