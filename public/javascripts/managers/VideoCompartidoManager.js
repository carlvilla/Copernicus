function VideoCompartidoManager(ws, utils, $translate) {

    var scope;
    var username;
    var sala;

    var API;

    var copiaUrl;

    this.inicializar = function ($scope, usernameParam, salaParam) {
        scope = $scope;
        username = usernameParam;
        sala = salaParam;

        if (copiaUrl) {
            scope.url = copiaUrl;
        }

    };

    this.setAPI = function (APIParam) {
        API = APIParam;
    }

    this.cambiarVideo = function (url) {
        API.stop();
        scope.url = url;
        copiaUrl = url;
        sendData(url);
    };

    this.cambiarVideoRemoto = function (url, username) {
        if (scope) {
            API.stop();
            scope.url = url;
            copiaUrl = url;
        }
        else {
            copiaUrl = url;
        }

        utils.mensajeInfo($translate.instant('CAMBIO_VIDEO') + username);
    };

    function sendData(url) {
        ws.send(JSON.stringify(
            {
                'seccion': 'video',
                'data': {
                    'username': username,
                    'sala': sala,
                    'url': url
                }
            }));
    };
}