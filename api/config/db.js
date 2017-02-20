var dbConfig = require('../config/config');

var db = dbConfig.dbLocal;

if (process.env.NODE_ENV == 'production') {
    //db = config.db.remote;
}


module.exports.db = db;



