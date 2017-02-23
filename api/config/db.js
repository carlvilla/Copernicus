var config = {};

if (process.env.NODE_ENV == 'production') {
    config.db = {
        URI: 'http://hobby-cpklccdfjildgbkehgkkfaol.dbs.graphenedb.com:24789/db/data/',
        user: 'thesis',
        pass: process.env.REMOTE_DB_PASS
    };

} else{
    config.db = {
        URI: 'http://localhost:7474/db/data',
        user: 'neo4j',
        pass: process.env.LOCAL_DB_PASS
    };

}


module.exports.db = config;



