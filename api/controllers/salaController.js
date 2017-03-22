/**
 * Created by carlosvillablanco on 23/03/2017.
 */
var utils = require('../utils/utils');

var model = require('seraph-model');
var confDB = require('../config/db')
var seraph = require('seraph')({
    server: confDB.db.server,
    user: confDB.db.user,
    pass: confDB.db.pass
});

var sala = model(seraph, 'Sala');

sala.schema = {
    id: { type: Integer, required: true},
    nombre: { type: String, required: true },
    descripcion: {type: String}
};

module.exports.createSala = function(req, res) {

}

/**
 * Busca las salas en las que el usuario es administrador a miembro
 * @param req
 * @param res
 */
module.exports.findSalasParticipa = function(req, res) {


}


module.exports.findSalasMiembro = function(req, res) {

}

module.exports.findSalasAdmin = function(req, res) {

}

/**
 * Busca las salas en las que el usuario es candidato. Esto es que 
 * se ha enviado una solicitud al usuario a que se una a una sala,
 * pero todavía no la ha aceptado.
 * @param req
 * @param res
 */
module.exports.findSalasCandidato = function(req, res) {

}


module.exports.deleteSala = function(req, res) {

}

module.exports.modifySala = function(req, res) {

}

