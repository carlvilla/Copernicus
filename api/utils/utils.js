var moment = require('moment');
var crypto = require('crypto');
//var jwt = require('jwt-simple');

module.exports.sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

/**
 * Crea hash y salt a partir de la contraseña pasada como parámetro
 * @param password
 * @returns {{salt, hash}}
 */
module.exports.setPassword = function(password){
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha1').toString('hex');

    return {
        salt: salt,
        hash: hash
    };
};

module.exports.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
    //Necesitare forma
};


module.exports.generateJwt = function(username, nombre) {
    var payload = {
        sub: {
            _id: this._id,
            username: username,
            nombre: nombre
        },
        iat: moment().unix(),
        exp: moment().add(14, "days").unix()
    };

  //  return jwt.encode(payload, process.env.JWT_SECRET);
};

