/**
 * Created by carlosvillablanco on 15/02/2017.
 */

module.exports = function(app) {
    var http = require('http');
    var conf = require('../config');

    var port = conf.port;
    var server = http.createServer(app);

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening)

    function onError(error) {
        console.error(error.message);
    }

    function onListening() {
        console.log("Server is running on port: " + port);
    }

    return server;

}