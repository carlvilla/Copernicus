/**
 * @ngdoc function
 * @name copernicus.function:middleware
 *
 * @description
 * Middleware para verificar si existe el token generado al iniciar sesión.
 */

/**
 * @ngdoc property
 * @name jwt
 * @propertyOf copernicus.function:middleware
 * @description
 * Módulo 'jwt'.
 *
 **/
var jwt = require('jwt-simple');

/**
 * @ngdoc property
 * @name moment
 * @propertyOf copernicus.function:middleware
 * @description
 * Módulo 'moment'.
 *
 **/
var moment = require('moment');

/**
 * @ngdoc method
 * @name checkToken
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba si el token de sesión existe y es válido.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkToken = function (req, res, next) {

    var token = req.cookies.token;

    if (token) {
        try {
            var payload = jwt.decode(token, process.env.JWT_SECRET);
            next();
        }

        catch (err) {
            res.redirect('./index');
            var payload = jwt.decode(token, process.env.JWT_SECRET);
            if (payload.exp <= moment().unix()) {
                res.redirect('./index');
                req.sub = payload.sub;
                next();
            }
        }

    } else {
        res.redirect('./index');
        return res.status(403).send({
            success: false,
            message: 'No existe token de sesión'
        });
    }
};

/**
 * @ngdoc method
 * @name checkSesion
 * @methodOf copernicus.function:middleware
 * @description
 * Comprueba si el usuario está autenticado. En el caso de que esté autenticado correctamente se le redirigirá a la
 * página personal.
 *
 * @param {object} req Objeto de solicitud.
 * @param {object} res Objeto de respuesta.
 * @param {object} next Siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación.
 *
 **/
module.exports.checkSesion = function (req, res, next) {

    var token = req.cookies.token;

    if (token) {
        try {
            var payload = jwt.decode(token, process.env.JWT_SECRET);
            if (payload.exp > moment().unix()) {
                req.sub = payload.sub;
                res.redirect('./mainPage');
            }
        } catch (err) {
            next();
        }
    }
    next();

};