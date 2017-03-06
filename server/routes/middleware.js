// Middleware para verificar si existe el token generado al iniciar sesión

var jwt = require('jwt-simple');
var moment = require('moment');

module.exports.checkToken = function(req, res, next) {

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

    }else {
        res.redirect('./index');
        return res.status(403).send({
            success: false,
            message: 'No existe token de sesión'
        });
    }
};
