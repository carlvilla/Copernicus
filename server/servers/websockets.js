/**
 * @ngdoc function
 * @name copernicus.function:websockets
 *
 * @description
 * Utilizado por Express.js para la ejecución del servidor de WebSockets.
 */
module.exports = function (server) {

    /**
     * @ngdoc property
     * @name port
     * @propertyOf copernicus.function:websockets
     * @description
     * Puerto en el que escucha el servidor.
     *
     **/
    var port = process.env.HTTP_PORT || process.env.PORT || 8080;

    /**
     * @ngdoc property
     * @name port
     * @propertyOf copernicus.function:websockets
     * @description
     * Módulo 'ws'.
     *
     **/
    var WebSocket = require('ws');

    /**
     * @ngdoc property
     * @name wss
     * @propertyOf copernicus.function:websockets
     * @description
     * Servidor de WebSockets.
     *
     **/
    var wss = new WebSocket.Server({
        'server': server
    });

    /**
     * @ngdoc property
     * @name connections
     * @propertyOf copernicus.function:websockets
     * @description
     * Conexiones de los usuarios a salas.
     *
     **/
    var connections = [];

    wss.on('error', onError);
    wss.on('listening', onListening);
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

                            console.log("Añadiendo usuario: " + obj.data.username);

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

                            console.log("Número de usuario: " + connections.length);

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

                                console.log("inicio");

                                setDisponibleUsuarioVideollamada(obj.data.username, sala, true);

                                console.log("Usuario envió mensaje: " + obj.data.username)

                                var usuarios = getUsuarios(obj.data.username, sala);

                                var response = {
                                    'seccion': 'videoChat',
                                    'data': {
                                        'operacion': 'inicio',
                                        'usuarios': usuarios
                                    }
                                };

                                console.log("Enviar usuarios conectados");

                                ws.send(JSON.stringify(response));

                                break;

                            case 'offer':

                                console.log("offer:");

                                enviarA(message, obj.data.usernameObjetivo, sala);
                                break;


                            case 'answer':
                                console.log("answer");
                                enviarA(message, obj.data.usernameOrigen, sala);
                                break;


                            case 'candidate':
                                console.log("candidate");
                                enviarA(message, obj.data.otherUsername, sala);
                                break;

                            case 'desconectado':
                                setDisponibleUsuarioVideollamada(obj.data.username, sala, false);
                                broadcast(message, obj.data.username, sala);
                                break;


                            default:
                                console.log("Mensaje no reconocido");
                                break;

                        }

                        break;

                    case "presentacion":
                        console.log("Presentacion Web");
                        broadcast(message, obj.data.username, sala);
                        break;

                    case "chatTexto":
                        feedBack(broadcast(message, obj.data.username, sala), sala, 'chatTexto',
                            {
                                'participantes': (connections.filter(filtrarPorSala(sala)).length - 1),
                                'tipoMensaje': obj.data.tipo
                            });
                        break;

                    case "dibujos":
                        broadcast(message, obj.data.username, sala);
                        break;

                    case "radio":
                        broadcast(message, obj.data.username, sala);
                        break;

                    case "video":
                        broadcast(message, obj.data.username, sala);
                        break;

                    default:
                        console.log('Mensaje erróneo');
                        break;
                }
            }
        });

        /**
         * @ngdoc method
         * @name broadcast
         * @methodOf copernicus.function:websockets
         * @description
         * Se envía un mensaje a cada usuario conectado, excepto al usuario por el cual se envía el mensaje
         *
         * @param {object} message Mensaje a enviar.
         * @param {String} usuarioAccion Usuario que realizó la acción.
         * @param {String} sala Sala en la que se aplica el mensaje.
         *
         **/
        broadcast = function (message, usuarioAccion, sala) {

            var conexionUsuarioEnvia;

            connections.filter(filtrarPorSala(sala)).forEach(function (conexion) {
                    console.log(conexion.usuario.username);
                    if (conexion.usuario.username != usuarioAccion) {
                        if (conexion.ws.readyState == 1) {
                            console.log("Enviando mensaje a webSocketService");
                            console.log(conexion.usuario.username);
                            conexion.ws.send(message);
                        }
                        else {
                            console.log("Error: El estado del cliente es " + ws.readyState);
                        }
                    } else {
                        conexionUsuarioEnvia = conexion;
                    }
                }
            );

            return conexionUsuarioEnvia;
        };

        /**
         * @ngdoc method
         * @name obtenerInformacionAsistentes
         * @methodOf copernicus.function:websockets
         * @description
         * Obtenemos la información de los usuarios que ya estaban conectados, para comunicarsela al usuario
         * que se acaba de conectar.
         *
         * @param {object} ws Servidor de WebSockets.
         * @param {String} usuarioAccion Usuario que realizó la acción.
         * @param {String} sala Sala en la que se aplica el mensaje.
         *
         **/
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
         * @ngdoc method
         * @name desconectarUsuario
         * @methodOf copernicus.function:websockets
         * @description
         * Si el usuario se desconecta, lo eliminamos de la lista de usuarios conectados.
         *
         * @param {String} usuarioAccion Usuario que se desconectó.
         * @param {String} sala Sala en la que ocurre la desconexión.
         *
         **/
        desconectarUsuario = function (usuarioAccion, sala) {

            var conexiones = connections.filter(filtrarPorSala(sala));
            for (var i = 0; i < connections.length; i++) {
                if (connections[i].usuario.username == usuarioAccion && connections[i].sala == sala) {
                    connections.splice(i, 1);
                    break;
                }
            }
        };

        /**
         * @ngdoc method
         * @name feedBack
         * @methodOf copernicus.function:websockets
         * @description
         * Devuelve información al usuario que mandó información a otros.
         *
         * @param {object} conexion Conexión de un usuario.
         * @param {String} sala Sala en la que ocurrió la acción.
         * @param {String} seccion Sección del mensaje
         * @param {String} mensaje Mensaje que se envía.
         *
         **/
        feedBack = function (conexion, sala, seccion, mensaje) {
            console.log("Feedback");
            var message = {
                'seccion': seccion,
                'data': {
                    'tipo': 'feedback',
                    'username': conexion.usuario.username,
                    'mensaje': mensaje
                }
            };

            if (conexion.ws.readyState == 1) {
                console.log("Enviando mensaje a webSocketService");
                conexion.ws.send(JSON.stringify(message));
            }

            else {
                console.log("Error: El estado del cliente es " + ws.readyState);
            }

        };
    });

    /**
     * @ngdoc method
     * @name filtrarPorSala
     * @methodOf copernicus.function:websockets
     * @description
     * Utilizado para filtrar las conexiones, de modo que solo tengamos aquellas para la sala cuyo id es pasado
     * como parámetro
     *
     * @param {object} sala Filtrar conexiones por el id de la sala.
     * @return {boolean} Booleano que indica si la conexión pertenece a la sala indicada.
     *
     **/
    function filtrarPorSala(sala) {
        return function (conexion) {
            return conexion.sala == sala;
        }
    }

    /**
     * @ngdoc method
     * @name onError
     * @methodOf copernicus.function:websockets
     * @description
     * Utilizado cuando ocurre un error.
     *
     * @param {object} error Error ocurrido.
     *
     **/
    function onError(error) {
        console.error(error.message);
        process.exit(1);
    }

    /**
     * @ngdoc method
     * @name onError
     * @methodOf copernicus.function:websockets
     * @description
     * Indicar el puerto en el que escucha el servidor de WebSockets.
     *
     **/
    function onListening() {
        console.info('Servidor Websocket escuchando en el puerto: ' + port);
    }

    /**
     * @ngdoc method
     * @name IsJsonString
     * @methodOf copernicus.function:websockets
     * @description
     * Comprueba si un String es un JSON válido.
     *
     * @param {String} str String a comprobar.
     * @return {Boolean} Resultado de la comprobación.
     *
     **/
    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };


    /**
     * @ngdoc method
     * @name setDisponibleUsuarioVideollamada
     * @methodOf copernicus.function:websockets
     * @description
     * Establece el estado del usuario pasado como parámetro respecto a la videollamada.
     *
     * @param {String} username Nombre de usuario del usuario.
     * @param {String} sala Sala en la que ocurre la acción.
     * @param {String} disponible Estado del usuario respecto a la videollamada.
     *
     **/
    setDisponibleUsuarioVideollamada = function (username, sala, disponible) {
        console.log("Establecer usuario como disponible a " + disponible + " : " + username);
        connections.filter(filtrarPorSala(sala)).forEach(function (conexion) {
            if (conexion.usuario.username == username) {
                conexion.videoChat = {
                    'disponible': disponible
                }
            }
        });

    };

    /**
     * @ngdoc method
     * @name getUsuarios
     * @methodOf copernicus.function:websockets
     * @description
     * Obtiene los demás usuarios disponibles para hacer una videoconferencia en la sala
     *
     * @param {String} usernameEnvia Nombre de usuario del usuario que busca conocer los usuarios disponible para
     * una videollamada.
     * @param {String} sala Sala en la que ocurre la acción.
     *
     **/
    getUsuarios = function (usernameEnvia, sala) {
        var usuarios = [];
        console.log("Obtener usuarios");
        connections.filter(filtrarPorSala(sala)).forEach(function (conexion) {
            if (conexion.usuario.username != usernameEnvia) {
                if (conexion.videoChat && conexion.videoChat.disponible)
                    usuarios.push(conexion.usuario.username);
            }

        });
        return usuarios;
    };

    /**
     * @ngdoc method
     * @name enviarA
     * @methodOf copernicus.function:websockets
     * @description
     * Envía el mensaje al usuario especificado de una sala concreta.
     *
     * @param {object} message Mensaje enviado.
     * @param {String} usernameSeEnvia Nombre de usuario del usuario al que se envía el mensaje.
     * @param {String} sala Sala en la que ocurre la acción.
     *
     **/
    enviarA = function (message, usernameSeEnvia, sala) {
        console.log("Enviando mensaje a " + usernameSeEnvia);
        connections.filter(filtrarPorSala(sala)).forEach(function (conexion) {
            if (conexion.usuario.username == usernameSeEnvia) {
                if (conexion.ws && conexion.ws.readyState == 1)
                    conexion.ws.send(message);
            }
        });
    };
};
