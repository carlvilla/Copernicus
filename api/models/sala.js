/**
 * Created by carlosvillablanco on 23/03/2017.
 */
var confDB = require('../config/db')

var seraph = require('seraph')({
    server: confDB.db.server,
    user: confDB.db.user,
    pass: confDB.db.pass
});

var model = require('seraph-model');

var sala = model(seraph, 'Sala');

sala.schema = {
    id: { type: Integer, required: true},
    nombre: { type: String, required: true },
    descripcion: {type: String}
};
