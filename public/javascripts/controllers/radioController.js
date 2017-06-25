var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:radioController
 *
 * @description
 * Este controlador es utilizado para comunicar al usuario con 'RadioManager', de modo que pueda enviar y recibir la URL
 * de una emisora o canción.
 *
 */
copernicus.controller('radioController', function ($scope, $rootScope, webSocketService) {

    /**
     * @ngdoc property
     * @name usuario
     * @propertyOf copernicus.controller:radioController
     * @description
     * Almacena los datos del usuario.
     *
     **/
    var usuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.controller:radioController
     * @description
     * Almacena los datos de la sala accedida.
     *
     **/
    var sala;

    /**
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:radioController
     * @description
     * Inicializa el controlador, obteniendo los datos de la sala y del usuario e inicializa 'RadioManager'
     * enviándole el nombre de usuario del usuario y el id de la sala.
     *
     **/
    var inicializacion = function () {
        //Usuario almacenado en el rootScope
        usuario = $rootScope.usuario;

        //Id de la sala a la que se accedió
        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));
        webSocketService.radioManager.inicializar(usuario.username, sala.idSala);
    };

    inicializacion();

    /**
     * @ngdoc method
     * @name play
     * @methodOf copernicus.controller:radioController
     * @description
     * Indica a 'RadioManager' que el usuario quiere reproducir la emisora o canción.
     *
     **/
    $scope.play = function () {
        webSocketService.radioManager.play();
    };

    /**
     * @ngdoc method
     * @name cambiarEmisora
     * @methodOf copernicus.controller:radioController
     * @description
     * Indica a 'RadioManager' que el usuario quiere cambiar la URL utilizada.
     *
     **/
    $scope.cambiarEmisora = function () {
        webSocketService.radioManager.cambiarEmisora($scope.url);
    };

    /**
     * @ngdoc method
     * @name setVolumen
     * @methodOf copernicus.controller:radioController
     * @description
     * Indica a 'RadioManager' que el usuario quiere cambiar el volumen.
     *
     **/
    $scope.setVolumen = function () {
        webSocketService.radioManager.setVolumen($scope.volumen);
    };

});