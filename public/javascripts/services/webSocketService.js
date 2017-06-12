angular.module('copernicus')
    .factory('webSocketService', function ($websocket, utils, $translate) {
        if (!window.WebSocket) {
            console.log("WebSockets no están soportados con este navegador");
        }
        var HOST = location.origin.replace(/^http/, 'ws');
        var ws = $websocket(HOST);

        var asistentesManager = new AsistentesManager(ws);
        var videoChatManager = new VideoChatManager(ws);
        var presentacionManager = new PresentacionManager(ws);
        var chatTextoManager = new ChatTextoManager(ws);
        var dibujosManager = new DibujosManager(ws);
        var radioManager = new RadioManager(ws, utils, $translate);
        var videoCompartidoManager = new VideoCompartidoManager(ws, utils, $translate);

        ws.onOpen(function () {
            console.log("Abriendo webSocketService");
        });

        //Si se cierra la ventana o se utilizan las flechas de navegación, se hace una llamada a este método
        window.addEventListener("beforeunload", function (e) {
            asistentesManager.setDisconnected();
            videoChatManager.setDisconnected();
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
                        videoChatManager.getMessage(obj.data);
                        break;

                    case "presentacion":
                        presentacionManager.actualizarPresentacion(obj.data);
                        break;

                    case "dibujos":
                        dibujosManager.accion(obj.data);
                        break;

                    case "chatTexto":
                        chatTextoManager.addMensaje(obj.data);
                        break;

                    case "radio":
                        radioManager.cambiarEmisoraRemoto(obj.data.url, obj.data.username);
                        break;

                    case "video":
                        videoCompartidoManager.cambiarVideoRemoto(obj.data.url,  obj.data.youtube, obj.data.username);
                        break;

                }
            }
        });
        var methods = {
            ws: ws,
            asistentesManager: asistentesManager,
            videoChatManager: videoChatManager,
            presentacionManager: presentacionManager,
            chatTextoManager: chatTextoManager,
            dibujosManager: dibujosManager,
            radioManager: radioManager,
            videoCompartidoManager: videoCompartidoManager
        };
        return methods;
    });