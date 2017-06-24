var copernicus = angular.module('copernicus');

copernicus.controller('dibujosController', function ($scope, $rootScope, webSocketService) {

    var usuario;
    var sala;

    var inicializacion = function () {
        usuario = $rootScope.usuario;
        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));

        webSocketService.dibujosManager.inicializar(usuario.username, sala.idSala);
    }

    inicializacion();


    $scope.addCirculo = function () {
        webSocketService.dibujosManager.addCirculo();
    };

    $scope.addTriangulo = function () {
        webSocketService.dibujosManager.addTriangulo();
    };

    $scope.addRectangulo = function () {
        webSocketService.dibujosManager.addRectangulo();
    };

    $scope.dibujar = function () {
        webSocketService.dibujosManager.dibujar();
    };

    $scope.seleccionar = function () {
        webSocketService.dibujosManager.seleccionar();
    };

    $scope.borrar = function () {
        webSocketService.dibujosManager.borrar();
    };

});