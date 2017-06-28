/**
 * @ngdoc function
 * @name copernicus.function:http
 *
 * @description
 * Utilizado por Express.js para la ejecución del servidor HTTP.
 *
 * @return {object} Devuelve el servidor HTTP preparado.
 */
module.exports = function (app) {

    /**
     * @ngdoc property
     * @name http
     * @propertyOf copernicus.function:http
     * @description
     * Módulo 'http'.
     *
     **/
    var http = require('http');

    /**
     * @ngdoc property
     * @name port
     * @propertyOf copernicus.function:http
     * @description
     * Puerto en el que escucha el servidor.
     *
     **/
    var port = process.env.HTTP_PORT || process.env.PORT || 8080;

    /**
     * @ngdoc property
     * @name server
     * @propertyOf copernicus.function:http
     * @description
     * Puerto en el que escucha el servidor.
     *
     **/
    var server = http.createServer(app);

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening)

    /**
     * @ngdoc method
     * @name onError
     * @methodOf copernicus.function:http
     * @description
     * Método invocado en el caso de que ocurra un error en el servidor.
     *
     * @param {object} error Error ocurrido.
     *
     **/
    function onError(error) {
        console.error(error.message);
    }

    /**
     * @ngdoc method
     * @name onListening
     * @methodOf copernicus.function:http
     * @description
     * Indicar el puerto en el que escucha el servidor.
     *
     **/
    function onListening() {
        console.log("Servidor escuchando en el puerto: " + port);
    }

    return server;

}