/**
 * @ngdoc service
 * @name copernicus.service:webSocketService
 *
 * @description
 * Servicio encargado de recibir mensajes del servidor de WebSockets y ejecutar e invocar los métodos correspondientes
 * de los managers a partir de esos mensajes.
 */
angular.module('copernicus')
    .factory('webSocketService', function ($websocket, utils, $translate) {
        if (!window.WebSocket) {
            console.log("WebSockets no están soportados con este navegador");
        }

        /**
         * @ngdoc property
         * @name HOST
         * @propertyOf copernicus.service:webSocketService
         * @description
         * URI Servidor de WebSockets.
         *
         **/
        var HOST = location.origin.replace(/^http/, 'ws');

        /**
         * @ngdoc property
         * @name ws
         * @propertyOf copernicus.service:webSocketService
         * @description
         * Servidor de WebSockets.
         *
         **/
        var ws = $websocket(HOST);

        /**
         * @ngdoc property
         * @name asistentesManager
         * @propertyOf copernicus.service:webSocketService
         * @description
         * Se crea instancia de 'AsistentesManager' pasandole el servidor de WebSockets.
         *
         **/
        var asistentesManager = new AsistentesManager(ws);

        /**
         * @ngdoc property
         * @name videollamadasManager
         * @propertyOf copernicus.service:webSocketService
         * @description
         * Se crea instancia de 'VideollamadasManager' pasandole el servidor de WebSockets, utils y el módulo $translate.
         *
         **/
        var videollamadasManager = new VideollamadasManager(ws, utils, $translate);

        /**
         * @ngdoc property
         * @name presentacionesManager
         * @propertyOf copernicus.service:webSocketService
         * @description
         * Se crea instancia de 'PresentacionesManager' pasandole el servidor de WebSockets, utils y el módulo $translate.
         *
         **/
        var presentacionesManager = new PresentacionesManager(ws, utils, $translate);

        /**
         * @ngdoc property
         * @name chatTextoManager
         * @propertyOf copernicus.service:webSocketService
         * @description
         * Se crea instancia de 'ChatTextoManager' pasandole el servidor de WebSockets, utils y el módulo $translate.
         *
         **/
        var chatTextoManager = new ChatTextoManager(ws, utils, $translate);

        /**
         * @ngdoc property
         * @name dibujosManager
         * @propertyOf copernicus.service:webSocketService
         * @description
         * Se crea instancia de 'DibujosManager' pasandole el servidor de WebSockets.
         *
         **/
        var dibujosManager = new DibujosManager(ws);

        /**
         * @ngdoc property
         * @name radioManager
         * @propertyOf copernicus.service:webSocketService
         * @description
         * Se crea instancia de 'RadioManager' pasandole el servidor de WebSockets, utils y el módulo $translate.
         *
         **/
        var radioManager = new RadioManager(ws, utils, $translate);

        /**
         * @ngdoc property
         * @name videoCompartidoManager
         * @propertyOf copernicus.service:webSocketService
         * @description
         * Se crea instancia de 'VideoCompartidoManager' pasandole el servidor de WebSockets, utils y el módulo $translate.
         *
         **/
        var videoCompartidoManager = new VideoCompartidoManager(ws, utils, $translate);

        ws.onOpen(function () {
            console.log("Abriendo webSocketService");
        });

        //Si se cierra la ventana o se utilizan las flechas de navegación, se hace una llamada a este método
        window.addEventListener("beforeunload", function (e) {
            asistentesManager.setDesconectado();
            videollamadasManager.setDesconectado();
            ws.close();
        });

        ws.onMessage(function (message) {
            if (utils.IsJsonString(message.data)) {
                var obj = JSON.parse(message.data);

                switch (obj.seccion) {

                    case "asistentes":
                        if (obj.data.operacion == 'connected') {
                            console.log("Añadiendo asistente conectado");
                            asistentesManager.addAsistente(obj.data);
                        }
                        else if (obj.data.operacion == 'disconnected') {
                            console.log("Desconectando desde webSocketService");
                            asistentesManager.deleteAsistente(obj.data);
                        }
                        break;

                    case "videoChat":
                        videollamadasManager.getMessage(obj.data);
                        break;

                    case "presentacion":
                        presentacionesManager.actualizarPresentacion(obj.data);
                        break;

                    case "dibujos":
                        dibujosManager.accion(obj.data);
                        break;

                    case "chatTexto":
                        if (obj.data.tipo != "feedback") {
                            chatTextoManager.addMensaje(obj.data);
                        }
                        else {
                            chatTextoManager.getFeedback(obj.data);
                        }
                        break;

                    case "radio":
                        radioManager.cambiarEmisoraRemoto(obj.data.url, obj.data.username);
                        break;

                    case "video":
                        videoCompartidoManager.cambiarVideoRemoto(obj.data.url, obj.data.youtube, obj.data.username);
                        break;

                }
            }
        });
        var methods = {
            ws: ws,
            asistentesManager: asistentesManager,
            videollamadasManager: videollamadasManager,
            presentacionesManager: presentacionesManager,
            chatTextoManager: chatTextoManager,
            dibujosManager: dibujosManager,
            radioManager: radioManager,
            videoCompartidoManager: videoCompartidoManager
        };
        return methods;
    });