angular.module('webApp')
    .factory('webSocketService', function ($websocket, utils) {
        if (!window.WebSocket) {
            console.log("WebSockets no están soportados con este navegador");
        }
        var HOST = location.origin.replace(/^http/, 'ws');
        var ws = $websocket(HOST);
        var asistentesManager = new AsistentesManager(ws);
        var videoconferenciaManager = new VideoconferenciaManager(ws);

        ws.onOpen(function () {
            console.log("Abriendo webSocketService");
        });

        //Si se cierra la ventana o se utilizan las flechas de navegación, se hace una llamada a este método
        window.addEventListener("beforeunload", function (e) {
            asistentesManager.setDisconnected();
            videoconferenciaManager.setDisconnected();
            ws.close();
        });


        ws.onMessage(function (message) {
            console.log("webSocketService");
            if (utils.IsJsonString(message.data)) {
                var obj = JSON.parse(message.data);
                switch (obj.seccion) {
                    case "asistentes":
                        if (obj.data.operacion == 'connected') {
                            console.log("Añadiendo asistente conectado");
                            asistentesManager.addAsistente(obj.data);
                        }
                        else if (obj.data.operacion == 'disconnected')
                            asistentesManager.deleteAsistente(obj.data);
                        break;

                    case "videoconference":
                        videoconferenciaManager.getMessage(obj.data);
                        break;
                }
            }
        });
        var methods = {
            ws: ws,
            asistentesManager: asistentesManager,
            videoconferenciaManager: videoconferenciaManager,
        };
        return methods;
    });