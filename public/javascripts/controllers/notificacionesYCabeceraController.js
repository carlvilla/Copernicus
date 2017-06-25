var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:notificacionesYCabeceraController
 *
 * @description
 * Este controlador está encargado de obtener las solicitudes del usuario para mostrarle notificaciones, y de obtener
 * la información del usuario para mostrarla en la cabecera de la página.
 */
copernicus.controller('notificacionesYCabeceraController', function ($scope, $http, $cookies, utils, $translate) {

    /**
     * @ngdoc property
     * @name usuario
     * @propertyOf copernicus.controller:notificacionesYCabeceraController
     * @description
     * Almacena los datos del usuario.
     *
     **/
    $scope.usuario;

    /**
     * @ngdoc property
     * @name solicitudes
     * @propertyOf copernicus.controller:notificacionesYCabeceraController
     * @description
     * Almacena las solicitudes de contacto del usuario.
     *
     **/
    $scope.solicitudes;

    /**
     * @ngdoc property
     * @name solicitudesSala
     * @propertyOf copernicus.controller:notificacionesYCabeceraController
     * @description
     * Almacena las solicitudes de unión a salas del usuario.
     *
     **/
    $scope.solicitudesSala;


    /**
     * @ngdoc method
     * @name successPerfil
     * @methodOf copernicus.controller:notificacionesYCabeceraController
     * @description
     * Almacena en el atributo 'usuario' los datos del usuario.
     *
     * @param {object} res Respuesta de la API REST con los datos del usuario.
     *
     **/
    function successPerfil(res) {
        if (res.data[0])
            $scope.usuario = res.data[0];
        else
            $scope.usuario = undefined;
    }

    /**
     * @ngdoc method
     * @name successSolicitudes
     * @methodOf copernicus.controller:notificacionesYCabeceraController
     * @description
     * Almacena en el atributo 'solicitudes' las solicitudes de contacto del usuario.
     *
     * @param {object} res Respuesta de la API REST con los datos de la solicitudes de contacto del usuario.
     *
     **/
    function successSolicitudes(res) {
        $scope.solicitudes = res.data;
    }

    /**
     * @ngdoc method
     * @name successSala
     * @methodOf copernicus.controller:notificacionesYCabeceraController
     * @description
     * Almacena en el atributo 'solicitudesSala' las solicitudes de unión a salas del usuario.
     *
     * @param {object} res Respuesta de la API REST con los datos de la solicitudes de unión a salas del usuario.
     *
     **/
    function successSala(res) {
        $scope.solicitudesSala = res.data;
    }

    /**
     * @ngdoc method
     * @name error
     * @methodOf copernicus.controller:notificacionesYCabeceraController
     * @description
     * Muestra un mensaje de error.
     *
     * @param {object} err Respuesta de la API REST.
     *
     **/
    function error(err) {
        utils.mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
    }

    /**
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:notificacionesYCabeceraController
     * @description
     * Obtiene la información del usuario y sus solicitudes de contacto y de unión a salas.
     *
     **/
    var inicializacion = function () {
        if ($cookies.get('token')) {
            $http({
                method: "GET",
                url: "api/solicitudesContacto"
            }).then(successSolicitudes, error);

            $http({
                method: "GET",
                url: "api/solicitudesSala"
            }).then(successSala, error);

            $http({
                method: "GET",
                url: "api/perfil"
            }).then(successPerfil);
        }
    }

    inicializacion();


});
