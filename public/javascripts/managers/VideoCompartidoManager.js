function VideoCompartidoManager(ws, utils, $translate) {

    var scope;
    var username;
    var sala;

    var API;

    //Variables necesarias en el caso de que se cambió la URL, pero el usuario no tiene
    //abierto el servicio de video compartido
    var copiaUrl;
    var copiaYoutube;

    this.inicializar = function ($scope, usernameParam, salaParam) {
        scope = $scope;
        username = usernameParam;
        sala = salaParam;

        if (copiaUrl) {
            scope.url = copiaUrl;
            scope.youtube = copiaYoutube;
        }

    };

    this.setAPI = function (APIParam) {
        API = APIParam;
    }

    this.cambiarVideo = function (url) {
        //  API.stop();
        scope.url = url;
        copiaUrl = url;
        sendData(url);
    };

    this.cambiarVideoRemoto = function (url, youtube, username) {
        if (scope) {
            if (!youtube) {
                API.stop();
            }
            scope.youtube = youtube;
            scope.url = url;
            copiaUrl = url;
        }
        else {
            copiaYoutube = youtube;
            copiaUrl = url;
        }

        utils.mensajeInfo($translate.instant('CAMBIO_VIDEO') + username);
    };

    this.setYoutube = function (boolean) {
        scope.youtube = boolean;
    }

    function sendData(url) {
        ws.send(JSON.stringify(
            {
                'seccion': 'video',
                'data': {
                    'username': username,
                    'sala': sala,
                    'url': url,
                    'youtube': scope.youtube
                }
            }));
    };
}