/**
 * @ngdoc function
 * @name copernicus.function:utils
 *
 * @description
 * Proporciona métodos de utilidad.
 */

/**
 * @ngdoc property
 * @name moment
 * @propertyOf copernicus.function:utils
 * @description
 * Módulo 'moment'.
 *
 **/
var moment = require('moment');

/**
 * @ngdoc property
 * @name crypto
 * @propertyOf copernicus.function:utils
 * @description
 * Módulo 'crypto'.
 *
 **/
var crypto = require('crypto');

/**
 * @ngdoc property
 * @name crypto
 * @propertyOf copernicus.function:utils
 * @description
 * Módulo 'jwt'.
 *
 **/
var jwt = require('jwt-simple');


/**
 * @ngdoc method
 * @name sendJSONresponse
 * @methodOf copernicus.function:utils
 * @description
 * Devuelve una respuesta al cliente.
 *
 * @param {object} req Objeto de respuesta
 * @param {object} status Código HTTP
 * @param {object} content Contenido de la respuesta
 *
 **/
module.exports.sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

/**
 * @ngdoc method
 * @name setPassword
 * @methodOf copernicus.function:utils
 * @description
 * Crea un hash y salt a partir de la contraseña pasada como parámetro.
 *
 * @param {String} password Contraseña cuya hash y salt se quiere obtener.
 * @return {object} Objeto que contiene el hash y salt resultante.
 *
 **/
module.exports.setPassword = function(password){
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha1').toString('hex');

    return {
        salt: salt,
        hash: hash
    };
};

/**
 * @ngdoc method
 * @name validPassword
 * @methodOf copernicus.function:utils
 * @description
 * Comprueba que la contraseña introducida sea válida generando un hash y comparandolo con el hash almacenado en la
 * base de datos.
 *
 * @param {String} password Contraseña.
 * @param {String} hash Hash real.
 * @param {String} salt Salt almacenada en la base de datos.
 * @return {boolean} Booleano que indica si la contraseña es válida.
 *
 **/
module.exports.validPassword = function(password, hash, salt) {
    var hashAux = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha1').toString('hex');
    return hash === hashAux;
};

/**
 * @ngdoc method
 * @name generateJwt
 * @methodOf copernicus.function:utils
 * @description
 * Genera un token de sesión en el que se almacena el nombre de usuario y nombre del usuario, y que tiene una validez de
 * un día.
 *
 * @param {String} username Nombre de usuario del usuario.
 * @param {String} nombre Nombre del usuario.
 * @return {String} Token de sesión generado.
 *
 **/
module.exports.generateJwt = function(username, nombre) {
    var payload = {
        sub: {
            _id: this._id,
            username: username,
            nombre: nombre
        },
        iat: moment().unix(),
        exp: moment().add(1, "days").unix()
    };

    return jwt.encode(payload, process.env.JWT_SECRET);
};

/**
 * @ngdoc method
 * @name getUsername
 * @methodOf copernicus.function:utils
 * @description
 * Devuelve el username del usuario que realizó la petición.
 *
 * @param {String} req Objeto de solicitud.
 * @return {String} Nombre de usuario del usuario.
 *
 **/
module.exports.getUsername = function(req){
    var token = req.cookies.token;
    var payload = jwt.decode(token, process.env.JWT_SECRET);
    return payload.sub.username;
};