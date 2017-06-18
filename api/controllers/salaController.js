/**
 * Created by carlosvillablanco on 23/03/2017.
 */
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

var sala = model(db, 'Sala');

sala.schema = {
    id: {type: Number, required: true},
    nombre: {type: String, required: true},
    descripcion: {type: String}
};

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});

/**
 * Crea una sala con la información pasada y la relaciona con los usuarios pasados en la petición
 *
 * @param req
 * @param res
 */
module.exports.createSala = function (req, res) {

    var username = utils.getUsername(req);
    var sala = req.body.sala;
    var descripcion = sala.descripcion;
    var fotoPorDefecto = sala.fotoPorDefecto;

    if (descripcion == undefined)
        descripcion = "";

    var foto;

    if(sala.nombre > 50){
        utils.sendJSONresponse(res, 400, 'nombre');
    }else if(sala.descripcion > 200){
        utils.sendJSONresponse(res, 400, 'descripcion');
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
            var querySala = "CREATE(s:Sala{idSala:" + idSala + ", nombre:'" + sala.nombre + "', descripcion:'"
                + descripcion + "', foto:'" + foto + "'})";

            db.query(querySala, function (err, result) {
                if (err) {
                    //Error al crear la sala
                    utils.sendJSONresponse(res, 500, err);
                }
                else {

                    //Relacionamos los usuarios elegidos con la sala con una la relación pasada en el atributo permiso del
                    //usuario
                    if (usuarios.length > 0) {
                        var queryUsuario;
                        usuarios.forEach(function (usuario) {
                            queryUsuario = "MATCH(u:Usuario{username:'" + usuario.username + "'}),(s:Sala{idSala:" + idSala
                                + "}) CREATE(u)-[:Candidato{permisos:'" + usuario.permisos + "'}]->(s)";
                            db.query(queryUsuario, function (err, result) {
                                if (err) {
                                    utils.sendJSONresponse(res, 500, err);
                                }
                            });

                        })
                    }

                    //Relacionamos el creador de la sala con la sala con una relación de tipo Admin
                    var queryAdmin = "MATCH(u:Usuario{username:'" + username + "'}),(s:Sala{idSala:" + idSala
                        + "}) CREATE(u)-[:Admin]->(s)";

                    db.query(queryAdmin, function (err, result) {
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
 * Busca las salas en las que el usuario es administrador a miembro
 * @param req
 * @param res
 */
module.exports.findSalasParticipa = function (req, res) {

    var username = utils.getUsername(req);

    var query = "MATCH (Usuario { username: '" + username + "' })-[:Miembro|Admin|Moderador]-(Sala) RETURN Sala"


    db.query(query, function (err, result) {
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

module.exports.checkParticipante = function (req, res) {

    var username = utils.getUsername(req);

    var query = "MATCH (u:Usuario{username:'" + username + "'}),(s:Sala{idSala:" + req.body.idSala + "})where (u)-" +
        "[:Miembro | Admin | Moderador]->(s) return s";


    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else if (result.length == 1) {
            utils.sendJSONresponse(res, 200, result);
        } else {
            //El usuario no tiene permisos para acceder a esta sala
            utils.sendJSONresponse(res, 403, err);
        }
    });
}


/**
 * Busca las salas en las que el usuario es candidato. Esto es que
 * se ha enviado una solicitud al usuario a que se una a una sala,
 * pero todavía no la ha aceptado.
 * @param req
 * @param res
 */
module.exports.findSalasCandidato = function (req, res) {

    var username = utils.getUsername(req);

    var query = "MATCH (u:Usuario{username:'" + username + "'}),(s:Sala)where (u)-" +
        "[:Candidato]->(s) return s";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 200, result);
        }
    });
};

/**
 * Devuelve las salas en las que el usuario es administrador
 *
 * @param req
 * @param res
 */
module.exports.findSalasAdmin = function (req, res) {

    var username = utils.getUsername(req);

    var query = "MATCH (u:Usuario{username:'" + username + "'}),(s:Sala)where (u)-" +
        "[:Admin]->(s) return s";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 200, result);
        }
    });


}

/**
 * Devuelve las salas en las que el usuario es moderador
 *
 * @param req
 * @param res
 */
module.exports.findSalasModerador = function (req, res) {
    var username = utils.getUsername(req);

    var query = "MATCH (u:Usuario{username:'" + username + "'}),(s:Sala)where (u)-" +
        "[:Moderador]->(s) return s";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 200, result);
        }
    });

}/**
 * Devuelve las salas en las que el usuario es miembro. Esto es, que no es ni administrador ni moderador
 *
 * @param req
 * @param res
 */
module.exports.findSalasMiembro = function (req, res) {
    var username = utils.getUsername(req);

    var query = "MATCH (u:Usuario{username:'" + username + "'}),(s:Sala)where (u)-" +
        "[:Miembro]->(s) return s";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 200, result);
        }
    });

}

module.exports.aceptarSolicitud = function (req, res) {
    var username = utils.getUsername(req);
    var idSala = req.body.idSala;

    //Elimina la relación de candidato entre el usuario y sala, y devuelve los permisos que se han concedido
    //al usuario en la sala
    var queryBorrarCandidato = "MATCH(u:Usuario{username:'" + username + "'})-[c:Candidato]->(s:Sala{idSala:" + idSala + "}) WITH c as candidato, " +
        "c.permisos as permisos DELETE candidato RETURN permisos"

    db.query(queryBorrarCandidato, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            var permisos = result[0].permisos;

            //Relaciona el usuario con la sala utilizando los permisos que se le concedieron
            var queryAddUsuario = "MATCH(u:Usuario{username:'" + username + "'}),(s:Sala{idSala:" + idSala
                + "}) CREATE(u)-[:" + permisos + "]->(s)";

            db.query(queryAddUsuario, function (err, result) {
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
 * Elimina la relación de candidato entre el usuario y sala. Si se envía un nombre de usuario en la petición, se
 * reliminará la relación 'Candidato' entre ese usuario y la sala pasado. Si no es así, se eliminará la relación
 * entre el usuario que envió la solicitud y la sala enviada.
 *
 * @param req
 * @param res
 */
module.exports.ignorarSolicitud = function (req, res) {

    var username = req.body.username;

    if (!username) {
        username = utils.getUsername(req);
    }

    var idSala = req.body.idSala;

    var query = "MATCH(u:Usuario{username:'" + username + "'})-[c:Candidato]->(s:Sala{idSala:" + idSala + "}) DELETE c"

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 204, "");
        }
    });

}

/**
 * Devuelve los participantes de una sala (Miembros, Admin y Moderadores)
 *
 * @param req
 * @param res
 */
module.exports.participantesSala = function (req, res) {

    var idSala = req.body.idSala;

    var query = "MATCH(user:Usuario)-[rel:Miembro | Admin | Moderador]->(s:Sala{idSala:" + idSala + "}) " +
        "RETURN user,rel"

    db.query(query, function (err, result) {
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

module.exports.actualizarDatos = function (req, res) {

    var idSala = req.body.idSala;
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var fotoCambiada = req.body.fotoCambiada;
    var foto = req.body.foto;

    if(nombre == ''){
        utils.sendJSONresponse(res, 400, 'nombre');
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
            var query = "MATCH(s:Sala{idSala:" + idSala + "}) SET s.nombre = '" + nombre + "', s.descripcion = '"
                + descripcion + "', s.foto = '" + result.secure_url + "'";
            ejecutarQuery(query);
        });
    } else {
        //Si la foto no se modificó, solo cambiamos el nombre y descripción de la sala
        var query = "MATCH(s:Sala{idSala:" + idSala + "}) SET s.nombre = '" + nombre + "', s.descripcion = '" + descripcion + "'";
        ejecutarQuery(query);
    }


}

/**
 * Elimina la relación entre el usuario y la sala especificados
 *
 * @param req
 * @param res
 */
module.exports.eliminarUsuario = function (req, res) {
    var idSala = req.body.idSala;
    var username = req.body.username;

    //En el caso de que no se pase un usuario significa que es el usuario que envía la petición cuya
    //relación con la sala debe de ser eliminada
    if(!username){
        username = utils.getUsername(req);
    }

    var query = "MATCH(Sala{idSala:" + idSala + "})-[r]-(Usuario{username:'" + username + "'}) delete r";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 204, "");
        }
    });
}

/**
 * Elimina la sala cuyo ID es pasado como parámetro
 *
 * @param req
 * @param res
 */
module.exports.eliminarSala = function (req, res) {
    var idSala = req.body.idSala;

    var query = "OPTIONAL MATCH()-[r]->(s:Sala{idSala:" + idSala + "}) delete r,s";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 204, "");
        }
    });
}

module.exports.cambiarPermisos = function (req, res) {
    var idSala = req.body.idSala;
    var username = req.body.username;
    var permisos = req.body.permisos;

    var query = "MATCH(u:Usuario{username:'" + username + "'})-[r]->(s:Sala{idSala:" + idSala + "}) " +
        "CREATE (u)-[r2:" + permisos + "]->(s) DELETE r";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 204, "");
        }
    });
}

module.exports.cambiarPermisosCandidato = function (req, res) {
    var idSala = req.body.idSala;
    var username = req.body.username;
    var permisos = req.body.permisos;

    var query = "MATCH(u:Usuario{username:'" + username + "'})-[r]->(s:Sala{idSala:" + idSala + "}) " +
        "CREATE (u)-[r2:Candidato{permisos:'" + permisos + "'}]->(s) DELETE r";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        } else {
            utils.sendJSONresponse(res, 204, "");
        }
    });
}

/**
 * Envía una invitación a un usuario a unirse a la sala creando una relación 'CANDIDATO' entre el usuario y la sala.
 * Los permisos dados al usuario son de 'Miembro'.
 *
 * @param req
 * @param res
 */
module.exports.invitacion = function (req, res) {
    var idSala = req.body.idSala;
    var username = req.body.username;

    var query = "MATCH(u:Usuario{username:'" + username + "'}),(s:Sala{idSala:" + idSala
        + "}) CREATE(u)-[:Candidato{permisos:'Miembro'}]->(s)";

    db.query(query, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        }
    });
};


/**
 * Devuelve los participantes de una sala (Miembros, Admin y Moderadores)
 *
 * @param req
 * @param res
 */
module.exports.candidatos = function (req, res) {

    var idSala = req.body.idSala;

    var query = "MATCH(user:Usuario)-[rel:Candidato]->(s:Sala{idSala:" + idSala + "}) " +
        "RETURN user,rel"

    db.query(query, function (err, result) {
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


/*

 Esta consulta devuelve todas las salas con las que está relacionado el usuario
 con username 'prueba'

 MATCH (Usuario { username: 'prueba' })--(Sala)
 RETURN Sala

 Esta consulta devuelve todas las salas en las que el usuario es administrador
 (También puede ser 'Candidato' o 'Miembro')

 MATCH (Usuario { username: 'prueba' })-[:Admin]-(Sala)
 RETURN Sala

 Esta consulta devuelve todas las salas en las que el usuario es administrador o miembro

 MATCH (Usuario { username: 'prueba' })-[:Miembro|Admin]-(Sala)
 RETURN Sala



 */