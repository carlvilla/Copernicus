var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:videollamadasController
 *
 * @description
 * Este controlador es utilizado para comunicar al usuario con 'VideollamadasManager', de modo que el usuario pueda
 * participar a una videollamada y controlar el micrófono, el sonido y el video retransmitido a otros usuarios.
 */
copernicus.controller('videollamadasController', function ($scope, $rootScope, webSocketService) {

    /**
     * @ngdoc property
     * @name usuario
     * @propertyOf copernicus.controller:videollamadasController
     * @description
     * Almacena los datos del usuario.
     *
     **/
    var usuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.controller:videollamadasController
     * @description
     * Almacena los datos de la sala a la que se accedió.
     *
     **/
    var sala;

    /**
     * @ngdoc property
     * @name muteMicrophone
     * @propertyOf copernicus.controller:videollamadasController
     * @description
     * Booleano que indica si el micrófono está silenciado.
     *
     **/
    $scope.muteMicrophone = false;

    /**
     * @ngdoc property
     * @name muteAltavoz
     * @propertyOf copernicus.controller:videollamadasController
     * @description
     * Booleano que indica si el altavoz está silenciado.
     *
     **/
    $scope.muteAltavoz = false;

    /**
     * @ngdoc property
     * @name video
     * @propertyOf copernicus.controller:videollamadasController
     * @description
     * Booleano que indica si el video está desactivado.
     *
     **/
    $scope.video = false;

    /**
     * @ngdoc method
     * @name incializacion
     * @methodOf copernicus.controller:videollamadasController
     * @description
     * Inicializa el controlador, obteniendo los datos de la sala y el usuario e inicializa 'VideollamadasManager'
     * pasandole el nombre de usuario e ID de la sala.
     *
     **/
    var incializacion = function(){
        usuario = $rootScope.usuario;
        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));
        webSocketService.videollamadasManager.inicializar(usuario.username, sala.idSala);
    }

    incializacion();


    /**
     * @ngdoc method
     * @name setAltavoz
     * @methodOf copernicus.controller:videollamadasController
     * @description
     * Indica a 'VideollamadasManager' que el usuario quiere silenciar o activar el altavoz.
     *
     **/
    $scope.setAltavoz = function(){
        webSocketService.videollamadasManager.setAltavoz($scope.muteAltavoz);
    }

    /**
     * @ngdoc method
     * @name setMicrofono
     * @methodOf copernicus.controller:videollamadasController
     * @description
     * Indica a 'VideollamadasManager' que el usuario quiere silenciar o activar el micrófono.
     *
     **/
    $scope.setMicrofono = function(){
        webSocketService.videollamadasManager.setMicrofono(!$scope.muteMicrophone);
    }

    /**
     * @ngdoc method
     * @name stopVideo
     * @methodOf copernicus.controller:videollamadasController
     * @description
     * Indica a 'VideollamadasManager' que el usuario quiere activar o desactivar el video.
     *
     **/
    $scope.stopVideo = function(){
        webSocketService.videollamadasManager.setVideo(!$scope.video);
    }

    /**
     * @ngdoc method
     * @name cerrarServicio
     * @methodOf copernicus.controller:videollamadasController
     * @description
     * Indica a 'VideollamadasManager' que el usuario ha cerrado el servicio de videollamadas.
     *
     **/
    $scope.cerrarServicio = function () {
        webSocketService.videollamadasManager.setDesconectado();
    }

});
