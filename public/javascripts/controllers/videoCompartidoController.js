var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:VideoCompartidoController
 *
 * @description
 * Este controlador es utilizado para comunicar al usuario con 'VideoCompartidoManager', de modo que pueda
 * enviar y recibir la URL de los videos.
 */
copernicus.controller('videoCompartidoController', function ($scope, $rootScope, webSocketService) {

    /**
     * @ngdoc property
     * @name usuario
     * @propertyOf copernicus.controller:VideoCompartidoController
     * @description
     * Almacena los datos del usuario.
     *
     **/
    var usuario;

    /**
     * @ngdoc property
     * @name usuario
     * @propertyOf copernicus.controller:VideoCompartidoController
     * @description
     * Almacena los datos de la sala a la que se accedió.
     *
     **/
    var sala;

    /**
     * @ngdoc property
     * @name youtube
     * @propertyOf copernicus.controller:VideoCompartidoController
     * @description
     * Booleano que indica si la URL del video es de un video de YouTube o no.
     *
     **/
    $scope.youtube = false;

    /**
     * @ngdoc method
     * @name inicializar
     * @methodOf copernicus.controller:VideoCompartidoController
     * @description
     * Inicializa el controlador, obteniendo los datos de la sala y el usuario e inicializa 'VideoCompartidoManager'
     * pasandole el nombre de usuario e ID de la sala.
     *
     **/
    var inicializar = function () {
        usuario = $rootScope.usuario;
        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));
        webSocketService.videoCompartidoManager.inicializar(usuario.username, sala.idSala, $scope);
    }

    inicializar();

    /**
     * @ngdoc method
     * @name cambiarVideo
     * @methodOf copernicus.controller:VideoCompartidoController
     * @description
     * Modifica el video que se está reproduciendo a través de VideoCompartidoManager. Se comprueba antes si el video
     * pasado es de YouTube ya que en ese caso es necesario utilizar otro reproductor.
     *
     **/
    $scope.cambiarVideo = function () {

        var urlCambiar = $scope.urlCambiar;

        if(urlCambiar.indexOf("youtube") !== -1 || urlCambiar.indexOf("youtu.be") !== -1){
            webSocketService.videoCompartidoManager.setYoutube(true);
        }else{
            webSocketService.videoCompartidoManager.setYoutube(false);
        }

        webSocketService.videoCompartidoManager.cambiarVideo($scope.urlCambiar);


    }

    /**
     * @ngdoc method
     * @name onPlayerReady
     * @methodOf copernicus.controller:VideoCompartidoController
     * @description
     * Cuando el reproductor de video está preparado, se le pasa su API a 'VideoCompartidoManager' de modo que lo pueda
     * controlar.
     *
     * @param {object} API API del reproductor de video.
     *
     **/
    $scope.onPlayerReady = function (API){
        webSocketService.videoCompartidoManager.setAPI(API);
    }

});