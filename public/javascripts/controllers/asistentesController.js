var webApp = angular.module('webApp');

webApp.controller('asistentesController', function ($scope, $http, $cookies, webSocketService) {

    $http({
        method: "GET",
        url: "api/profile"
    }).then(success, error);

    function success(res) {

        //Obtenemos los datos del usuario que se acaba de conectar
        var usuario = res.data[0];

        //Avisamos a los demás asistentes de la sala que el usuario se conectó
        webSocketService.asistentesManager.setConnected(usuario.username, usuario.nombre);

        //Obtenemos los asistentes conectados en la sala
        var asistentes = webSocketService.asistentesManager.getAsistentes();

        //Eliminamos al usuario que se acaba de conectar de la lista para no mostrarlo en su listado de
        //asistentes conectados
        asistentes.splice(asistentes.indexOf(usuario), 1);

        $scope.asistentes = asistentes;
    };

    function error(res) {
        console.log(res);
    };

});


