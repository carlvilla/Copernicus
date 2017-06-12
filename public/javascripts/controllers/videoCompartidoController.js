var copernicus = angular.module('copernicus');

copernicus.controller('videoCompartidoController', function ($scope, $rootScope, webSocketService) {

    //Username del usuario de esta sesión
    var username = $rootScope.usuario.username;

    $scope.youtube = false;

    //Id de la sala a la que se accedió
    var sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada")).idSala;

    var inicializar = function () {
        webSocketService.videoCompartidoManager.inicializar($scope, username, sala);
    }

    inicializar();

    $scope.cambiarVideo = function () {

        var urlCambiar = $scope.urlCambiar;


        if(urlCambiar.indexOf("youtube") !== -1 || urlCambiar.indexOf("youtu.be") !== -1){
            webSocketService.videoCompartidoManager.setYoutube(true);
        }else{
            webSocketService.videoCompartidoManager.setYoutube(false);
        }



        webSocketService.videoCompartidoManager.cambiarVideo($scope.urlCambiar);





    }

    $scope.onPlayerReady = function (API){
        webSocketService.videoCompartidoManager.setAPI(API);
    }

});