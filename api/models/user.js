var confDB = require('../config/db')
var db = require('seraph')({
    URI: confDB.db.URI,
    user: confDB.db.user,
    pass: confDB.db.pass});

var model = require('seraph-model');
var User = model(db, 'User');

var moment = require('moment');
var crypto = require('crypto');
var jwt = require('jwt-simple');

User.schema = {
    username: { type: String, required: true},
    nombre: { type: String, required: true },
    apellidos: {type: String, required: true },
    email: { type: String, match: emailRegex, required: true },
    hash: { type: String },
    salt: {type: String}

}

user.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

User.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};


User.methods.generateJwt = function() {
    var payload = {
        sub: {
            _id: this._id,
            userName: this.userName,
            name: this.name
        },
        iat: moment().unix(),
        exp: moment().add(14, "days").unix()
    };

    return jwt.encode(payload, process.env.JWT_SECRET);
};
