var confDB = require('../config/db')
var db = require('seraph')({
    URI: confDB.db.URI,
    user: confDB.db.user,
    pass: confDB.db.pass});

var model = require('seraph-model');

var user = model(db, 'User');

user.schema = {
    username: { type: String, required: true},
    nombre: { type: String, required: true },
    apellidos: {type: String, required: true },
    email: { type: String, match: emailRegex, required: true },
    hash: { type: String },
    salt: {type: String}


}