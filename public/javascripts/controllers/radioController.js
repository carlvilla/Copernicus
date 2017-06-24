var copernicus = angular.module('copernicus');

copernicus.controller('radioController', function ($scope, $rootScope, webSocketService) {

    var usuario;
    var sala;

    var inicializacion = function () {
        //Usuario almacenado en el rootScope
        usuario = $rootScope.usuario;

        //Id de la sala a la que se accedió
        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));
        webSocketService.radioManager.inicializar(usuario.username, sala.idSala);
    };

    inicializacion();

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