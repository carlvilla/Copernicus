module.exports = function (server) {
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

            ws.on('close', function () {
                console.log('Cerrando servidor WebSocket');
            });

            console.log("webSockets");

            if (IsJsonString(message)) {
                var obj = JSON.parse(message);
                switch (obj.seccion) {
                    case "asistentes":
                        if (obj.data.operacion == "connected") {

                            var conexion = {
                                'ws': ws,
                                'usuario': {
                                    'username': obj.data.username,
                                    'nombre': obj.data.nombre
                                }
                            }

                            console.log("Añadiendo usuario");

                            connections.forEach(function (con) {
                                if (con.usuario.username == conexion.usuario.username) {
                                    console.log("usuario ya registrado");
                                }
                            });

                            connections.push(conexion);

                            //Notificar a otros usuarios del asistente conectado
                            broadcast(message, obj.data.username);
                            obtenerInformacionAsistentes(ws, obj.data.username);
                        }
                        else if (obj.data.operacion == "disconnected") {
                            console.log("Usuario desconectandose");
                            //Notificar a otros usuarios del asistente desconectado
                            broadcast(message, obj.data.username);
                            desconectarUsuario(obj.data.username);

                        }
                        break;

                    default:
                        console.log('Mensaje erróneo');
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
                    if (conexion.usuario.username != usuarioAccion) {
                        if (conexion.ws) {
                            console.log("Enviando mensaje a webSocketService");
                            conexion.ws.send(message);
                        }
                    }
                }
            );
        };


        /**
         * Obtenemos la información de los usuarios que ya estaban conectados, para comunicarsela al usuario
         * que se acaba de conectar
         *
         * @param ws
         * @param usuarioAccion
         */
        obtenerInformacionAsistentes = function (ws, usuarioAccion) {
            connections.forEach(function (conexion) {
                if (conexion.usuario.username != usuarioAccion) {
                    var message = {
                        'seccion': 'asistentes',
                        'data': {
                            'operacion': 'connected',
                            'username': conexion.usuario.username,
                            'nombre': conexion.usuario.nombre
                        }
                    };

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
                if (connections[i].usuario.username == usuarioAccion) {
                    connections.splice(i, 1);
                    break;
                }
            }
        };
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








    setVideoconferenceEnabled = function (sentBy, enabled) {
        for (var i = 0; i < connections.length; i++) {
            if (connections[i].user.username == sentBy) {
                connections[i].videoconference = {
                    'enabled': enabled,
                }
            }
        }
    };


    getOtherUserNames = function (sentBy) {
        var others = [];
        connections.forEach(function (cnn) {
            if (cnn.user.username != sentBy) {
                if (cnn.videoconference.enabled)
                    others.push(cnn.user.username);
            }
        });
        return others;
    };


    sendTo = function(message, sentTo) {
        connections.forEach(function(cnn) {
            if (cnn.user.username == sentTo) {
            }
            console.log('Sent: %s to %s', message, sentTo);
            if (cnn.ws) cnn.ws.send(message);
        });
    };






};
