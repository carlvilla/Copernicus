angular.module('copernicus')
    .factory('webSocketService', function ($websocket, utils, $translate) {
        if (!window.WebSocket) {
            console.log("WebSockets no están soportados con este navegador");
        }
        var HOST = location.origin.replace(/^http/, 'ws');

        var ws = $websocket(HOST);

        var asistentesManager = new AsistentesManager(ws);
        var videollamadasManager = new VideollamadasManager(ws);
        var presentacionesManager = new PresentacionesManager(ws, utils, $translate);
        var chatTextoManager = new ChatTextoManager(ws, utils, $translate);
        var dibujosManager = new DibujosManager(ws);
        var radioManager = new RadioManager(ws, utils, $translate);
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