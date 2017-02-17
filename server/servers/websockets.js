module.exports = function(server){
    var config = require('../config');
    var WebSocketServer = require('ws').Server;

    var wss = new WebSocketServer({
        'server' : server
    });

    wss.on('error', onError);
    wss.on('listening', onListening);

    var connections = [];

    wss.on('connection', function(ws) {
        console.log('Creating WebSocketServer connection');

        ws.on('close', function () {
            console.log('Closing WebSocketServer connection');
        });
    });

    function onError(error){
        console.error(error.message);
        process.exit(1);
    }

    function onListening(){
        console.info('The Websocket server is running on Port: '+config.port);
    }


}