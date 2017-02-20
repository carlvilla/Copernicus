var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var model = require('seraph-model');
var dbConfig = require('../config/config');
var user = model(dbConfig.dbLocal, 'User');
var crypto = require('crypto');

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        user.findAll('MATCH (u:User) WHERE u.username = {name}',{name: username} ,function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, {
                    message: 'Usuario incorrecto.'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Contraseña incorrecta.'
                });
            }
            return done(null, user);
        });
    }
));

