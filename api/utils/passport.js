var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var utils = require('./utils');

var dbConfig = require('../config/db');
var db = require('seraph')({
    server: dbConfig.db.server,
    user: dbConfig.db.user,
    pass: dbConfig.db.pass
});

passport.use(new localStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function (username, password, done) {

        var query = "MATCH(u:Usuario{username:'" + username + "'}) return u";
        db.query(query, function (err, usuario) {
            if (err) {
                return done(err);
            }
            if (!usuario[0]) {
                return done(null, false, {
                    message: 'Usuario y/o contraseña incorrectos.'
                });
            }
            //Aqui es donde necesito obtener la hash y la salt y pasarselo al método validPassword
            if (!utils.validPassword(password, usuario[0].hash, usuario[0].salt)) {
                return done(null, false, {
                    message: 'Contraseña incorrecta.'
                });
            }
            return done(null, usuario[0]);
        });
    }
));

