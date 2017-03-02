var config = {};

if (process.env.NODE_ENV == 'production') {
    var url = require('url').parse(process.env.GRAPHENEDB_URL)

    config = {

        server: url.protocol + '//' + url.host,
        user: url.auth.split(':')[0],
        pass: url.auth.split(':')[1]

    };

} else{
    config = {
        URI: 'http://localhost:7474/db/data',
        user: process.env.LOCAL_DB_USER,
        pass: process.env.LOCAL_DB_PASS,
        server: 'http://localhost:7474'
    };

}
module.exports.db = config;