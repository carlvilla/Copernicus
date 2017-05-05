/**
 * Created by carlosvillablanco on 23/03/2017.
 */
var utils = require('../utils/utils');
var jwt = require('jwt-simple');

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

/**
 * Crea una sala con la información pasada y la relaciona con los usuarios pasados en la petición
 *
 * @param req
 * @param res
 */
module.exports.createSala = function (req, res) {

    var username = utils.getUsername(req);

    var sala = req.body.sala.nombre;
    var descripcion = req.body.sala.descripcion;

    var usuarios = req.body.usuarios;

    var idSala;

    //Obtenemos el último idSala utilizado. Este id es necesario para identificar de forma unequivoca una sala
    var queryLastSalaID = "match(s:Sala) with s.idSala as id return id order by id desc limit 1";
    db.query(queryLastSalaID, function (err, result) {
        //Si no existe ninguna sala, se crea la primera con el id 1
        if(result[0]!=null)
            idSala = parseInt(result[0].id) + 1;
        else
            idSala = 1;

        //Creamos la sala
        var querySala = "CREATE(s:Sala{idSala:" + idSala + ", nombre:'" + sala + "', descripcion:'" + descripcion + "'})"
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
                        console.log(usuario.permisos);
                        queryUsuario = "MATCH(u:Usuario{username:'" + usuario.username + "'}),(s:Sala{idSala:" + idSala
                            + "}) CREATE(u)-[:Candidato{permisos:'" + usuario.permisos + "'}]->(s)";
                        db.query(queryUsuario, function (err, result) {
                            if (err) {
                                utils.sendJSONresponse(res, 500, err);
                            }
                        });

                    })

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

            }
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


}

module.exports.aceptarSolicitud = function (req, res) {

    var username = utils.getUsername(req);
    var idSala = req.body.idSala;

    //Elimina la relación de candidato entre el usuario y sala, y devuelve los permisos que se han concedido
    //al usuario en la sala
    var queryBorrarCandidato = "MATCH(u:Usuario{username:'"+username+"'})-[c:Candidato]->(s:Sala{idSala:"+idSala+"}) WITH c as candidato, " +
        "c.permisos as permisos DELETE candidato RETURN permisos"

    db.query(queryBorrarCandidato, function (err, result) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        }else{
            var permisos = result[0].permisos;

            //Relaciona el usuario con la sala utilizando los permisos que se le concedieron
            var queryAddUsuario = "MATCH(u:Usuario{username:'" + username + "'}),(s:Sala{idSala:" + idSala
                + "}) CREATE(u)-[:"+permisos+"]->(s)";

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

module.exports.ignorarSolicitud = function (req, res) {
    var username = utils.getUsername(req);
    var idSala = req.body.idSala;


    //Elimina la relación de candidato entre el usuario y sala
    var query = "MATCH(u:Usuario{username:'"+username+"'})-[c:Candidato]->(s:Sala{idSala:"+idSala+"}) DELETE c"

    db.query(query, function (err, res) {
        if (err) {
            utils.sendJSONresponse(res, 500, err);
        }else{
            utils.sendJSONresponse(res, 200, "");
        }
    });

}


module.exports.findSalasMiembro = function (req, res) {

}

module.exports.findSalasAdmin = function (req, res) {

}

module.exports.deleteSala = function (req, res) {

}

//Puede que se necesite otro controlador, para gestionar las
//relaciones entre los usuarios y las salas. Este método sería
//utilizado para modificar el nombre y la descripción de la sala
module.exports.modifySala = function (req, res) {

}

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