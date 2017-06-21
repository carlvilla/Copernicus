module.exports = function (app) {
    var http = require('http');
    var port = process.env.HTTP_PORT || process.env.PORT || 8080;
    var server = http.createServer(app);

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening)

    function onError(error) {
        console.error(error.message);
    }

    function onListening() {
        console.log("Servidor escuchando en el puerto: " + port);
    }

    return server;

}