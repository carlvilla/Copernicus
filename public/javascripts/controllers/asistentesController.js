var copernicus = angular.module('copernicus');

copernicus.controller('asistentesController', function ($scope, $http, $cookies, $rootScope, webSocketService
    , utils, $translate) {

    //Usuario que se conecta
    var usuario;

    //Id de la sala a la que se accedió
    var sala;


    var inicializacion = function () {
        $http({
            method: "GET",
            url: "api/perfil"
        }).then(success, error);
    }

    inicializacion();

    function success(res) {

        //Obtenemos los datos del usuario que se acaba de conectar
        usuario = res.data[0];

        //Almacenamos los datos del usuario, de modo que no tenemos que volver a recuperarlo para utilizarlo
        //en los módulos u otras partes de la sala
        $rootScope.usuario = usuario;


        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));

        //Avisamos a los demás asistentes de la sala que el usuario se conectó
        webSocketService.asistentesManager.setConnected(usuario.username, usuario.nombre, sala.idSala);

        //Obtenemos los asistentes conectados en la sala
        var asistentes = webSocketService.asistentesManager.getAsistentes();

        //Eliminamos al usuario que se acaba de conectar de la lista para no mostrarlo en su listado de
        //asistentes conectados
        asistentes.splice(asistentes.indexOf(usuario), 1);

        $scope.asistentes = asistentes;

    };

    function error(res) {
        utils.mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
    };

});


