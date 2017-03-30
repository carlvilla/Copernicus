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

module.exports.createSala = function (req, res) {

}

/**
 * Busca las salas en las que el usuario es administrador a miembro
 * @param req
 * @param res
 */
module.exports.findSalasParticipa = function (req, res) {

    var token = req.cookies.token;
    var payload = jwt.decode(token, process.env.JWT_SECRET);

    var username = payload.sub.username;

    var query = "MATCH (Usuario { username: '"+username+"' })-[:Miembro|Admin]-(Sala) RETURN Sala"


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

module.exports.checkParticipante = function (req, res){

    var token = req.cookies.token;
    var payload = jwt.decode(token, process.env.JWT_SECRET);

    var username = payload.sub.username;

    var query = "MATCH (u:Usuario{username:'"+username+"'}),(s:Sala{idSala:"+ req.body.idSala +"})where (u)-" +
        "[:Miembro | Admin]->(s) return s";


    db.query(query, function(err, result){
       if(err){
           utils.sendJSONresponse(res, 500, err);
       } else if(result.length == 1){
           utils.sendJSONresponse(res, 200, result);
       } else{
           //El usuario no tiene permisos para acceder a esta sala
           utils.sendJSONresponse(res, 403, err);
       }
    });
}


module.exports.findSalasMiembro = function (req, res) {

}

module.exports.findSalasAdmin = function (req, res) {

}

/**
 * Busca las salas en las que el usuario es candidato. Esto es que
 * se ha enviado una solicitud al usuario a que se una a una sala,
 * pero todavía no la ha aceptado.
 * @param req
 * @param res
 */
module.exports.findSalasCandidato = function (req, res) {
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