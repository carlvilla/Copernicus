var webApp = angular.module('webApp');

webApp.controller('videoChatController', function ($scope, $rootScope, webSocketService) {

    //Usuario almacenado por asistentesController en el rootScope
    webSocketService.videoChatManager.setUsuario($rootScope.usuario);

    //Id de la sala a la que se accedió
    var sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada")).idSala;

    webSocketService.videoChatManager.start(sala);
    
    $scope.cerrarModulo = function(){
        webSocketService.videoChatManager.setDisconnected();
    }


});
