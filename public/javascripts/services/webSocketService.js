angular.module('webApp')
    .factory('webSocketService', function ($websocket, utils) {
        if (!window.WebSocket) {
            console.log("WebSockets no están soportados con este navegador");
        }
        var HOST = location.origin.replace(/^http/, 'ws');
        var ws = $websocket(HOST);
        var asistentesManager = new AsistentesManager(ws);

        ws.onOpen(function () {
            console.log("Open");
            //   growl.success('Server started. Enjoy!', {
            //      title: 'Success',
            // });
          //  setInterval(function () {
           //     ws.send('ping at ' + new Date().getUTCSeconds());
            //}, 30000);
        });
        window.onbeforeunload = function () {
            asistentesManager.setDisconnected();
            ws.close();
        };
        ws.onMessage(function (message) {
            if (utils.IsJsonString(message.data)) {
                var obj = JSON.parse(message.data);
                switch (obj.seccion) {
                    case "asistentes":
                        if (obj.data.operacion == 'connected') {
                            console.log("Añadir asistente");
                            asistentesManager.addAsistente(obj.data);
                        }
                        else if (obj.data.operacion == 'disconnected')
                            asistentesManager.deleteAsistente(obj.data);
                        break;
                }
            }
        });
        var methods = {
            ws: ws,
            asistentesManager: asistentesManager,
        };
        return methods;
    });