var copernicus = angular.module('copernicus');

copernicus.controller('radioController', function ($scope, $rootScope, webSocketService) {

    //Usuario almacenado en el rootScope
    var usuario = $rootScope.usuario;

    //Id de la sala a la que se accedió
    var sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada")).idSala;

    var inicializarModulo = function () {
        webSocketService.radioManager.inicializarModulo(usuario.username, sala);
    };

    inicializarModulo();

    $scope.play = function () {
        webSocketService.radioManager.play();
    };

    $scope.cambiarEmisora = function () {
        webSocketService.radioManager.cambiarEmisora($scope.url);
    };

    $scope.setVolumen = function () {
        webSocketService.radioManager.setVolumen($scope.volumen);
    };

});