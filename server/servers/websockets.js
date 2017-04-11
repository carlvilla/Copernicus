module.exports = function(server) {
    var config = require('../config');
    var WebSocketServer = require('ws').Server;

    var wss = new WebSocketServer({
        'server': server
    });

    wss.on('error', onError);
    wss.on('listening', onListening);

    var connections = [];

    wss.on('connection', function (ws) {

        console.log('Creando conexión a servidor WebSocket');

        ws.on('message', function (message) {
            console.log('Received: %s', message);
            if (IsJsonString(message)) {
                var obj = JSON.parse(message);
                switch (obj.section) {
                    case 'asistentes':
                        if (obj.data.operation == 'connected') {
                            connections.push({
                                'ws': ws,
                                'usuario': {
                                    'username': obj.data.username,
                                    'nombre': obj.data.nombre
                                }
                            });

                            //Notificar a otros usuarios del asistente conectado
                            broadcast(message, obj.data.username);
                            obtenerInformacionAsistentes(ws, obj.data.username);
                        }
                        else if (obj.data.operation == 'disconnected') {
                            //Notificar a otros usuarios del asistente desconectado
                            broadcast(message, obj.data.username);
                            desconectarUsuario(obj.data.username);

                        }
                        break;

                    default:
                        console.log('Unrecognized message');
                        break;

                }
            }
        });


        /**
         * Se envía un mensaje a cada usuario conectado, excepto al usuario por el cual se envía el mensaje
         *
         * @param message
         * @param usuarioAccion
         */
        broadcast = function (message, usuarioAccion) {
            connections.forEach(function (conexion) {
                if (conexion.user.username != usuarioAccion) {

                    console.log('Sent: %s to %s', message, conexion.user.username);

                    if (conexion.ws)
                        conexion.ws.send(message);

                }
            });
        };


        /**
         * Obtenemos la información de los usuarios que ya estaban conectados, para comunicarsela al usuario
         * que se acaba de conectar
         *
         * @param ws
         * @param usuarioAccion
         */
        obtenerInformacionAsistentes = function broadcast(ws, usuarioAccion) {
            connections.forEach(function (conexion) {
                if (conexion.user.username != usuarioAccion) {
                    var message = {
                        'seccion': 'asistentes',
                        'data': {
                            'operacion': 'connected',
                            'nombre': conexion.user.nombre,
                            'username': conexion.user.username

                        }
                    };
                    console.log('**Sent: %s to %s', JSON.stringify(message), usuarioAccion);

                    if (ws)
                        ws.send(JSON.stringify(message));
                }
            });
        };


        /**
         * Si el usuario se desconecta, lo eliminamos de la lista de usuarios conectados
         *
         * @param usuarioAccion
         */
        desconectarUsuario = function (usuarioAccion) {

            for (var i = 0; i < connections.length; i++) {
                if (connections[i].user.username == usuarioAccion) {
                    connections.splice(i, 1);
                    i--;
                }
            }
        };
    });


    wss.on('close', function () {
        console.log('Cerrando conexión con servidor WebSocket');
    });


    function onError(error) {
        console.error(error.message);
        process.exit(1);
    }

    function onListening() {
        console.info('Servidor Websocket escuchando en el puerto: ' + config.port);
    }

    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };


};
