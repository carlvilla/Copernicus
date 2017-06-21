var copernicus = angular.module('copernicus');

copernicus.controller('asistentesController', function ($scope, $http, $cookies, $rootScope, webSocketService) {

    $http({
        method: "GET",
        url: "api/perfil"
    }).then(success, error);

    function success(res) {

        //Obtenemos los datos del usuario que se acaba de conectar
        var usuario = res.data[0];

        //Almacenamos los datos del usuario, de modo que no tenemos que volver a recuperarlo para utilizarlo
        //en los módulos u otras partes de la sala
        $rootScope.usuario = usuario;

        //Id de la sala a la que se accedió
        var sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada")).idSala;

        //Avisamos a los demás asistentes de la sala que el usuario se conectó
        webSocketService.asistentesManager.setConnected(usuario.username, usuario.nombre, sala);

        //Obtenemos los asistentes conectados en la sala
        var asistentes = webSocketService.asistentesManager.getAsistentes();

        //Eliminamos al usuario que se acaba de conectar de la lista para no mostrarlo en su listado de
        //asistentes conectados
        asistentes.splice(asistentes.indexOf(usuario), 1);

        $scope.asistentes = asistentes;

        //Obtenemos todos los usuarios de la sala
        var usuariosAMostrar;

        $http({
            method: "POST",
            url: "api/participantesSala",
            data: {idSala: sala}
        }).then(function (res) {

            usuariosAMostrar = res.data;

            usuariosAMostrar.splice(usuariosAMostrar.indexOf(usuario), 1);

            $scope.participantes = usuariosAMostrar;

        }, error);

    };

    $scope.estaConectado = function (usuario) {

        var conectado = false;

        $scope.participantes.every(function (participante) {
            if(usuario.username == participante.username) {
             console.log("El participante: "+usuario.username+" , está conectado");
                conectado = true;
                return true;
            }
        })

        return conectado;

    };

    function error(res) {
        //console.log(res);
    };

});


