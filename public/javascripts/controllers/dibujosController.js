var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:dibujosController
 *
 * @description
 * Este controlador es utilizado para comunicar las acciones del usuario con el servicio de dibujos a 'DibujosManager',
 * y recibir las acciones de otros usuarios.
 */
copernicus.controller('dibujosController', function ($scope, $rootScope, webSocketService) {

    /**
     * @ngdoc property
     * @name usuario
     * @propertyOf copernicus.controller:dibujosController
     * @description
     * Usuario que está utilizando la sala.
     *
     **/
    var usuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.controller:dibujosController
     * @description
     * ID de la sala en la que está conectado el usuario.
     *
     **/
    var sala;


    /**
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:dibujosController
     * @description
     * Inicializa 'DibujosManager' comunicandole el usuario que acaba de abrir el servicio y en qué sala.
     *
     **/
    var inicializacion = function () {
        usuario = $rootScope.usuario;
        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));

        webSocketService.dibujosManager.inicializar(usuario.username, sala.idSala);
    }

    inicializacion();

    /**
     * @ngdoc method
     * @name addCirculo
     * @methodOf copernicus.controller:dibujosController
     * @description
     * Comunica a 'DibujosManager' que el usuario quiere añadir un circulo.
     *
     **/
    $scope.addCirculo = function () {
        webSocketService.dibujosManager.addCirculo();
    };

    /**
     * @ngdoc method
     * @name addTriangulo
     * @methodOf copernicus.controller:dibujosController
     * @description
     * Comunica a 'DibujosManager' que el usuario quiere añadir un triangulo.
     *
     **/
    $scope.addTriangulo = function () {
        webSocketService.dibujosManager.addTriangulo();
    };

    /**
     * @ngdoc method
     * @name addRectangulo
     * @methodOf copernicus.controller:dibujosController
     * @description
     * Comunica a 'DibujosManager' que el usuario quiere añadir un rectangulo.
     *
     **/
    $scope.addRectangulo = function () {
        webSocketService.dibujosManager.addRectangulo();
    };

    /**
     * @ngdoc method
     * @name dibujar
     * @methodOf copernicus.controller:dibujosController
     * @description
     * Comunica a 'DibujosManager' que el usuario quiere dibujar.
     *
     **/
    $scope.dibujar = function () {
        webSocketService.dibujosManager.dibujar();
    };

    /**
     * @ngdoc method
     * @name seleccionar
     * @methodOf copernicus.controller:dibujosController
     * @description
     * Comunica a 'DibujosManager' que el usuario quiere poder seleccionar figuras o dibujos.
     *
     **/
    $scope.seleccionar = function () {
        webSocketService.dibujosManager.seleccionar();
    };

    /**
     * @ngdoc method
     * @name borrar
     * @methodOf copernicus.controller:dibujosController
     * @description
     * Comunica a 'DibujosManager' que el usuario quiere todos las figuras y dibujos.
     *
     **/
    $scope.borrar = function () {
        webSocketService.dibujosManager.borrar();
    };

});