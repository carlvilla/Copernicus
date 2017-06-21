var copernicus = angular.module('copernicus');

copernicus.controller('videollamadasController', function ($scope, $rootScope, webSocketService) {

    //Usuario almacenado por asistentesController en el rootScope
    webSocketService.videollamadasManager.setUsuario($rootScope.usuario);


    //Id de la sala a la que se accedió
    var sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada")).idSala;

    webSocketService.videollamadasManager.start(sala);

    $scope.cerrarServicio = function () {
        webSocketService.videollamadasManager.setDisconnected();
    }

    $scope.muteMicrophone = false;
    $scope.mute = false;
    $scope.video = false;

    $scope.setAltavoz = function(){
        webSocketService.videollamadasManager.setAltavoz($scope.mute);
    }

    $scope.setMicrofono = function(){
        webSocketService.videollamadasManager.setMicrofono(!$scope.muteMicrophone);
    }

    $scope.stopVideo = function(){
        webSocketService.videollamadasManager.setVideo(!$scope.video);
    }

});
