// Middleware para verificar si existe el token generado al iniciar sesión

var jwt = require('jwt-simple');
var moment = require('moment');

/**
 * Comprueba si el token de sesión existe y es válido
 * @param req
 * @param res
 * @param next
 */
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
 * Comprueba si el usuario está autenticado. En el caso de que esté autenticado
 * correctamente se le redirigirá a la página personal.
 * @param req
 * @param res
 * @param next
 */
module.exports.checkSesion = function (req, res, next) {

    var token = req.cookies.token;

    if(token) {
        var payload = jwt.decode(token, process.env.JWT_SECRET);

        if (payload.exp > moment().unix()) {
            req.sub = payload.sub;
            res.redirect('./personalPage');
        }
    }

    next();

};
