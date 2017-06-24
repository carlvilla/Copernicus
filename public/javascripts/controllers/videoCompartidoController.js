var copernicus = angular.module('copernicus');

copernicus.controller('videoCompartidoController', function ($scope, $rootScope, webSocketService) {

    //Username del usuario de esta sesión
    var usuario;

    $scope.youtube = false;

    //Id de la sala a la que se accedió
    var sala;

    var inicializar = function () {
        usuario = $rootScope.usuario;
        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));
        webSocketService.videoCompartidoManager.inicializar(usuario.username, sala.idSala, $scope);
    }

    inicializar();

    /**
     * Modifica el video que se está reproduciendo a través de VideoCompartidoManager. Se comprueba antes si el video
     * pasado es de YouTube, ya que en ese caso es necesario utilizar otro reproductor.
     */
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