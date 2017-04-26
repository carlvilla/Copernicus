var webApp = angular.module('webApp');

webApp.controller('videoChatController', function ($scope, $rootScope, webSocketService) {

    webSocketService.videoChatManager.start();

    //Usuario almacenado por asistentesController en el rootScope
    webSocketService.videoChatManager.setUsuario($rootScope.usuario);

});
