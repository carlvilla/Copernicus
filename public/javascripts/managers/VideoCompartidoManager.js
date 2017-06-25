/**
 * @ngdoc function
 * @name copernicus.function:VideoCompartidoManager
 * @description
 * Este manager se encarga de la gestión del servicio de video compartido.
 */
function VideoCompartidoManager(ws, utils, $translate) {

    /**
     * @ngdoc property
     * @name usernameUsuario
     * @propertyOf copernicus.function:VideoCompartidoManager
     * @description
     * Nombre de usuario del usuario.
     *
     **/
    var usernameUsuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.function:VideoCompartidoManager
     * @description
     * ID de la sala.
     *
     **/
    var sala;

    /**
     * @ngdoc property
     * @name url
     * @propertyOf copernicus.function:VideoCompartidoManager
     * @description
     * URL del video actualmente establecido.
     *
     **/
    var url;

    /**
     * @ngdoc property
     * @name urlYoutube
     * @propertyOf copernicus.function:VideoCompartidoManager
     * @description
     * Booleano que indica si la URL es de YouTube.
     *
     **/
    var urlYoutube;

    /**
     * @ngdoc property
     * @name API
     * @propertyOf copernicus.function:VideoCompartidoManager
     * @description
     * API del reproductor de video.
     *
     **/
    var API;

    /**
     * @ngdoc property
     * @name scope
     * @propertyOf copernicus.function:VideoCompartidoManager
     * @description
     * Referencia al objeto scope de AngularJS.
     *
     **/
    var scope;

    /**
     * @ngdoc method
     * @name inicializar
     * @methodOf copernicus.function:VideoCompartidoManager
     * @description
     * Inicializa los valores de los atributoes 'scope', 'usernameUsuario' y 'sala'. En el caso de que el atributo
     * 'url' tuviese algún valor, eso significa que otro usuario pasó una URL antes de abrir el
     * servicio por lo que se carga esa URL en el reproductor.
     *
     * @param {String} username Nombre de usuario del usuario.
     * @param {String} salaParam ID de la sala.
     * @param {object} $scope Objeto $scope de AngularJS.
     *
     **/
    this.inicializar = function (usernameParam, salaParam, $scope) {
        usernameUsuario = usernameParam;
        sala = salaParam;
        scope = $scope;

        if (url) {
            scope.url = url;
            scope.youtube = urlYoutube;
        }

    };

    /**
     * @ngdoc method
     * @name setAPI
     * @methodOf copernicus.function:VideoCompartidoManager
     * @description
     *
     * Almacena en el atributo 'API' una referencia a la API del reproductor de video.
     *
     * @param {object} APIParam API del reproductor de video.
     *
     **/
    this.setAPI = function (APIParam) {
        API = APIParam;
    }

    /**
     * @ngdoc method
     * @name cambiarVideo
     * @methodOf copernicus.function:VideoCompartidoManager
     * @description
     *
     * Modifica la URL del video a mostrar, y comunica el cambio al resto de usuario conectados a la sala a través de
     * 'sendData'.
     *
     * @param {String} urlParam URL del video a reproducir.
     *
     **/
    this.cambiarVideo = function (urlParam) {
        scope.url = urlParam;
        url = urlParam;
        sendData(urlParam);

        utils.mensajeInfo($translate.instant('PREPARANDO_VIDEO'));

    };

    /**
     * @ngdoc method
     * @name cambiarVideoRemoto
     * @methodOf copernicus.function:VideoCompartidoManager
     * @description
     *
     * Modifica la URL del video a mostrar, ya que otro usuario la modificó.
     *
     * @param {String} urlParam URL del video a reproducir.
     * @param {boolean} youtube Indica si es un video de YouTube.
     * @param {String} username Nombre de usuario de la persona que modificó la URL.
     *
     **/
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

    /**
     * @ngdoc method
     * @name setYoutube
     * @methodOf copernicus.function:VideoCompartidoManager
     * @description
     *
     * Establece el atributo 'youtube' del scope al valor pasado como parámetro.
     *
     * @param {boolean} boolean Booleano.
     *
     **/
    this.setYoutube = function (boolean) {
        scope.youtube = boolean;
    }

    /**
     * @ngdoc method
     * @name setYoutube
     * @methodOf copernicus.function:VideoCompartidoManager
     * @description
     *
     * Envía la URL establecida a los usuarios conectados a la sala a través del servidor de WebSockets.
     *
     * @param {boolean} boolean Booleano.
     *
     **/
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