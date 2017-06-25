var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:asistentesController
 *
 * @description
 * Este controlador es utilizado cuando un usuario se conecta a una sala para obtener la información de ese usuario,
 * pasarla a 'AsistentesManager' para que otros usuarios en la sala lo vean como conectado
 * y obtener del mismo manager los usuarios que están conectado a la sala.
 */
copernicus.controller('asistentesController', function ($scope, $http, $cookies, $rootScope, webSocketService
    , utils, $translate) {

    /**
     * @ngdoc property
     * @name usuario
     * @propertyOf copernicus.controller:asistentesController
     * @description
     * Usuario que se conecta
     *
     **/
    var usuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.controller:asistentesController
     * @description
     * Id de la sala a la que se accedió
     *
     **/
    var sala;

    /**
     * @ngdoc property
     * @name asistentes
     * @propertyOf copernicus.controller:asistentesController
     * @description
     * Asistentes conectados a la sala
     *
     **/
    $scope.asistentes = {};


    /**
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:asistentesController
     * @description
     * Inicializa el controlador, obteniendo los datos del usuario que se conectó
     *
     **/
    var inicializacion = function () {
        $http({
            method: "GET",
            url: "api/perfil"
        }).then(success, error);
    }

    inicializacion();

    /**
     * @ngdoc method
     * @name success
     * @methodOf copernicus.controller:asistentesController
     * @description
     * Este método obtiene los datos del usuario de la respuesta que recibe como parámetro, comunica a
     * 'AsistentesManager' que el usuario se ha conectado y obtiene del mismo los usuarios conectados a la sala
     *
     * @param {object} res respuesta de la API REST con los datos del usuario
     *
     **/
    function success(res) {

        //Obtenemos los datos del usuario que se acaba de conectar
        usuario = res.data[0];

        //Almacenamos los datos del usuario, de modo que no tenemos que volver a recuperarlo para utilizarlo
        //en los módulos u otras partes de la sala
        $rootScope.usuario = usuario;

        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));

        //Avisamos a los demás asistentes de la sala que el usuario se conectó
        webSocketService.asistentesManager.setConectado(usuario.username, usuario.nombre, sala.idSala);

        //Obtenemos los asistentes conectados en la sala
        var asistentes = webSocketService.asistentesManager.getAsistentes();

        //Eliminamos al usuario que se acaba de conectar de la lista para no mostrarlo en su listado de
        //asistentes conectados
        asistentes.splice(asistentes.indexOf(usuario), 1);

        $scope.asistentes = asistentes;

    };

    /**
     * @ngdoc method
     * @name error
     * @methodOf copernicus.controller:asistentesController
     * @description
     * Muestra un mensaje de error en el caso de que no se pudo recuperar los datos del usuario
     *
     * @param {object} res respuesta de la API REST
     *
     **/
    function error(res) {
        utils.mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
    };

});


