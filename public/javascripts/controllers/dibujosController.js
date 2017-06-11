var copernicus = angular.module('copernicus');

copernicus.controller('dibujosController', function ($scope, $rootScope, webSocketService) {

    var username = $rootScope.usuario.username;
    var sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada")).idSala;

    webSocketService.dibujosManager.inicializarModulo(username, sala);

    $scope.addCirculo = function(){
        webSocketService.dibujosManager.addCirculo();
    };

    $scope.addTriangulo = function(){
        webSocketService.dibujosManager.addTriangulo();
    };

   $scope.addRectangulo = function(){
        webSocketService.dibujosManager.addRectangulo();
    };

   $scope.dibujar = function(){
        webSocketService.dibujosManager.dibujar();
    };

   $scope.seleccionar = function(){
        webSocketService.dibujosManager.seleccionar();
    };

   $scope.borrar = function(){
        webSocketService.dibujosManager.borrar();
    };

});