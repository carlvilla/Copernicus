/**
 * Created by carlosvillablanco on 19/02/2017.
 */
var config = {};


// To http://localhost:7474/db/data
config.dbLocal = {
    URI: 'http://localhost:7474/db/data',
    user: 'neo4j',
    pass: 'thesis'
};

/*
config.dbRemote = require("seraph")({ server: process.env.DDBB_URI,
    endpoint: "/neo",
    user: "root",
    pass: "jf8%kLs#!" });


    */

module.exports = config;
