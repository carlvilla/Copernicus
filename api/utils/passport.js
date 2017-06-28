/**
 * @ngdoc function
 * @name copernicus.function:passport
 *
 * @description
 * Valida si las credenciales del usuario son correctas.
 */

/**
 * @ngdoc property
 * @name passport
 * @propertyOf copernicus.function:passport
 * @description
 * Módulo 'passport'.
 *
 **/
var passport = require('passport');

/**
 * @ngdoc property
 * @name localStrategy
 * @propertyOf copernicus.function:passport
 * @description
 * Módulo que proporciona una estrategia para la autenticación de usuarios utilizando nombre de usuario y contraseña.
 *
 **/
var localStrategy = require('passport-local').Strategy;

/**
 * @ngdoc property
 * @name utils
 * @propertyOf copernicus.function:passport
 * @description
 * Referencia a 'Utils'.
 *
 **/
var utils = require('./utils');

/**
 * @ngdoc property
 * @name dbConfig
 * @propertyOf copernicus.function:passport
 * @description
 * Contiene la dirección y credenciales de la base de datos.
 *
 **/
var dbConfig = require('../config/db');

/**
 * @ngdoc property
 * @name db
 * @propertyOf copernicus.function:passport
 * @description
 * Atributo utilizado para realizar consultas contra la base de datos. Es creado con el módulo 'seraph' utilizando la
 * configuración de la base de datos contenida en 'dbConfig'.
 *
 **/
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