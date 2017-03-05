var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var utils = require('./utils');

var dbConfig = require('../config/db');
var seraph = require('seraph')({
    server: dbConfig.db.server,
    user: dbConfig.db.user,
    pass: dbConfig.db.pass
});
var model = require('seraph-model');
var user = model(seraph, 'User');

var crypto = require('crypto');

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        user.where({username: username}, function (err, usuario) {
            if (err) {
                return done(err);
            }
            if (!usuario[0]) {
                return done(null, false, {
                    message: 'Usuario y/o contraseña incorrectos.'
                });
            }
            //Aqui es donde necesito obtener la hash y la salt y pasarselo al método validPassword
            if (!utils.validPassword(password,usuario[0].hash,usuario[0].salt)) {
                return done(null, false, {
                    message: 'Contraseña incorrecta.'
                });
            }
            return done(null, usuario[0]);
        });
    }
));

