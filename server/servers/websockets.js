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
                var sala = obj.data.sala;

                switch (obj.seccion) {
                    case "asistentes":
                        if (obj.data.operacion == "connected") {

                            var conexion = {
                                'ws': ws,
                                'usuario': {
                                    'username': obj.data.username,
                                    'nombre': obj.data.nombre
                                },
                                'sala': sala
                            }

                            console.log("Añadiendo usuario");

                            var addUser = true;

                            connections.filter(filtrarPorSala(sala)).forEach(function (con) {
                                if (con.usuario.username == conexion.usuario.username) {
                                    console.log("usuario ya registrado");
                                    addUser = false;
                                }
                            });

                            if (addUser) {

                                connections.push(conexion);
                                console.log("Avisando a los demás usuarios");
                                //Notificar a otros usuarios del asistente conectado
                                broadcast(message, obj.data.username, sala);
                                obtenerInformacionAsistentes(ws, obj.data.username, sala);
                            }


                        }
                        else if (obj.data.operacion == "disconnected") {
                            console.log("Usuario desconectandose");
                            //Notificar a otros usuarios del asistente desconectado

                            //Eliminamos la conexión que había sido creada para el usuario.
                            //Hay que tener en cuenta que el usuario puede estar en otras sala, por
                            //lo que eliminamos la conexión de la sala correcta
                            connections.filter(filtrarPorSala(sala)).forEach(function (con) {
                                if (con.usuario.username == obj.data.username) {
                                    connections.splice(connections.indexOf(con), 1);
                                }
                            });

                            broadcast(message, obj.data.username, sala);
                            desconectarUsuario(obj.data.username, sala);

                        }
                        break;

                    case "videoChat":
                        switch (obj.data.operacion) {
                            case 'inicio':

                                setDisponibleUsuarioVideoChat(obj.data.username, true);

                                console.log("Usuario envió mensaje: " + obj.data.username)

                                var response = {
                                    'seccion': 'videoChat',
                                    'data': {
                                        'operacion': 'inicio',
                                        'usuarios': getUsuarios(obj.data.username, sala)
                                    }
                                };

                                console.log("Enviar usuarios conectados");

                                ws.send(JSON.stringify(response));

                                break;


                            case 'cerrar':
                                setDisponibleUsuarioVideoChat(obj.data.userName, false);
                                break;


                                defaul:
                                    console.log("Mensaje no reconocido");
                                break;

                        }

                        break;

                    default:
                        console.log('Mensaje erróneo');
                        break;

                }
            }
        });

        /**
         * Establece el estado del usuario pasado como parámetro respecto al video chat
         * @param username
         * @param disponible
         */
        setDisponibleUsuarioVideoChat = function (username, disponible) {
            connections.forEach(function (conexion) {
                if (conexion.usuario.username == username) {
                    conexion.videoChat = {
                        'disponible': disponible
                    }
                }
            });
        };

        /**
         * Obtiene los demás usuarios disponibles para hacer una videoconferencia en la sala
         *
         * @param sentBy
         * @returns {Array}
         */
        getUsuarios = function (sentBy, sala) {
            var usuarios = [];
            connections.filter(filtrarPorSala(sala)).forEach(function (conexion) {
                if (conexion.usuario.username != sentBy) {
                    if (conexion.videoChat.disponible)
                        usuarios.push(conexion.usuario.username);
                }

            });
            return usuarios;
        };


        /**
         * Se envía un mensaje a cada usuario conectado, excepto al usuario por el cual se envía el mensaje
         *
         * @param message
         * @param usuarioAccion
         */
        broadcast = function (message, usuarioAccion, sala) {
            connections.filter(filtrarPorSala(sala)).forEach(function (conexion) {
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
        obtenerInformacionAsistentes = function (ws, usuarioAccion, sala) {
            connections.filter(filtrarPorSala(sala)).forEach(function (conexion) {
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
        desconectarUsuario = function (usuarioAccion, sala) {

            var conexiones = connections.filter(filtrarPorSala(sala));

            for (var i = 0; i < connections.length; i++) {
                if (connections[i].usuario.username == usuarioAccion && connections[i].sala == sala) {
                    connections.splice(i, 1);
                    break;
                }
            }
        };
    });


    /**
     * Utilizado para filtrar las conexiones, de modo que solo tengamos aquellas para la sala cuyo id es pasado
     * como parámetro
     *
     * @param conexion
     * @param sala
     * @returns {boolean}
     */
    function filtrarPorSala(sala) {
        return function (conexion) {
            return conexion.sala == sala;
        }
    }


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
            if (connections[i].user.username == sentBy && connections[i].sala == sala) {
                connections[i].videoconference = {
                    'enabled': enabled,
                }
            }
        }
    };


    getOtherUserNames = function (sentBy) {
        var others = [];
        connections.forEach(function (cnn) {
            if (cnn.user.username != sentBy && connections[i].sala == sala) {
                if (cnn.videoconference.enabled)
                    others.push(cnn.user.username);
            }
        });
        return others;
    };


    sendTo = function (message, sentTo) {
        connections.forEach(function (cnn) {
            if (cnn.user.username == sentTo && connections[i].sala == sala) {
                console.log('Sent: %s to %s', message, sentTo);
                if (cnn.ws)
                    cnn.ws.send(message);
            }
        });
    };


};
