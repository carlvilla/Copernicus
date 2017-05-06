var webApp = angular.module('webApp');

webApp.controller("chatTextoController",function($scope, $rootScope , webSocketService){

    var usuario = $rootScope.usuario;

    //Usuario almacenado por asistentesController en el rootScope
    webSocketService.chatTextoManager.setUsuario(usuario.username);
    $scope.usernameUsuario = usuario.username;

    //Id de la sala a la que se accedió
    var sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada")).idSala;
    webSocketService.chatTextoManager.setSala(sala);

    $scope.mensajes = webSocketService.chatTextoManager.getMensajes();

    $scope.sendMensaje = function(mensaje){
        if(mensaje!="") {
            webSocketService.chatTextoManager.sendMensaje(mensaje);
            document.getElementById("texto-enviar").value = "";
            $scope.mensaje = "";
        }

    };

});