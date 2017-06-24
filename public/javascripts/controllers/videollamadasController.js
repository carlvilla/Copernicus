var copernicus = angular.module('copernicus');

copernicus.controller('videollamadasController', function ($scope, $rootScope, webSocketService) {

    //Usuario almacenado por asistentesController en el rootScope
    var usuario;

    //Id de la sala a la que se accedió
    var sala;

    $scope.muteMicrophone = false;
    $scope.muteAltavoz = false;
    $scope.video = false;

    var incializacion = function(){
        usuario = $rootScope.usuario;
        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));
        webSocketService.videollamadasManager.inicializar(usuario.username, sala.idSala);
    }

    incializacion();

    $scope.setAltavoz = function(){
        webSocketService.videollamadasManager.setAltavoz($scope.muteAltavoz);
    }

    $scope.setMicrofono = function(){
        webSocketService.videollamadasManager.setMicrofono(!$scope.muteMicrophone);
    }

    $scope.stopVideo = function(){
        webSocketService.videollamadasManager.setVideo(!$scope.video);
    }

    $scope.cerrarServicio = function () {
        webSocketService.videollamadasManager.setDesconectado();
    }


});
