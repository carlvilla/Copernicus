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
            setInterval(function () {
                ws.send('ping at ' + new Date().getUTCSeconds());
            }, 30000);
        });
        window.onbeforeunload = function () {
            asistentesManager.setDisconnected();
            ws.close();
        };
        ws.onMessage(function (message) {
            if (utils.IsJsonString(message.data)) {
                var obj = JSON.parse(message.data);
                switch (obj.section) {
                    case "asistentes":
                        if (obj.data.operation == 'connected')
                            asistentesManager.addPerson(obj.data);
                        else if (obj.data.operation == 'disconnected')
                            asistentesManager.deletePerson(obj.data);
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