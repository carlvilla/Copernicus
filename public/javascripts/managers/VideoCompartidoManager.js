function VideoCompartidoManager(ws, utils, $translate) {

    var usernameUsuario;
    var sala;

    //Variables necesarias en el caso de que se cambió la URL, pero el usuario no tiene
    //abierto el servicio de video compartido
    var url;
    var urlYoutube;

    var API;
    var scope;


    this.inicializar = function (usernameParam, salaParam, $scope) {
        usernameUsuario = usernameParam;
        sala = salaParam;
        scope = $scope;

        if (url) {
            scope.url = url;
            scope.youtube = urlYoutube;
        }

    };

    this.setAPI = function (APIParam) {
        API = APIParam;
    }

    this.cambiarVideo = function (urlParam) {
        scope.url = urlParam;
        url = urlParam;
        sendData(urlParam);

        utils.mensajeInfo($translate.instant('PREPARANDO_VIDEO'));

    };

    this.cambiarVideoRemoto = function (urlParam, youtube, username) {
        if (scope) {
            if (!youtube) {
                API.stop();
            }
            scope.youtube = youtube;
            scope.url = urlParam;
            url = urlParam;
        }
        else {
            urlYoutube = youtube;
            url = urlParam;
        }

        utils.mensajeInfo($translate.instant('CAMBIO_VIDEO') + username);
    };

    this.setYoutube = function (boolean) {
        scope.youtube = boolean;
    }

    function sendData(urlParam) {
        ws.send(JSON.stringify(
            {
                'seccion': 'video',
                'data': {
                    'username': usernameUsuario,
                    'sala': sala,
                    'url': urlParam,
                    'youtube': scope.youtube
                }
            }));
    };
}