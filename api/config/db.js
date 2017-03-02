var config = {};

if (process.env.NODE_ENV == 'production') {
    config = {
        URI: process.env.GRAPHENEDB_URL,
        user: process.env.GRAPHENEDB_BOLT_USER,
        pass: process.env.GRAPHENEDB_BOLT_PASSWORD,
        server: process.env.REMOTE_SERVER
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



