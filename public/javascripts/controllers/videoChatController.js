var copernicus = angular.module('copernicus');

copernicus.controller('videoChatController', function ($scope, $rootScope, webSocketService) {

    //Usuario almacenado por asistentesController en el rootScope
    webSocketService.videoChatManager.setUsuario($rootScope.usuario);


    //Id de la sala a la que se accedió
    var sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada")).idSala;

    console.log(sala);

    webSocketService.videoChatManager.start(sala);

    $scope.cerrarModulo = function () {
        webSocketService.videoChatManager.setDisconnected();
    }

    $scope.muteMicrophone = false;
    $scope.mute = false;
    $scope.video = false;

    $scope.setMuted = function(){
        webSocketService.videoChatManager.setMuted($scope.mute);
    }

    $scope.setMutedMicrophone = function(){
        webSocketService.videoChatManager.setMutedMicrophone(!$scope.muteMicrophone);
    }

    $scope.stopVideo = function(){
        webSocketService.videoChatManager.setVideo(!$scope.video);
    }

});
