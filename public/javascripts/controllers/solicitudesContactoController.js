var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:solicitudesContactoController
 *
 * @description
 * Este controlador está encargado de gestionar las solicitudes de contacto, mostrandolas y permitiendo aceptarlas
 * o ignorarlas.
 *
 */
copernicus.controller('solicitudesContactoController', function ($scope, $http, $window, utils, $translate) {

    /**
     * @ngdoc property
     * @name solicitudes
     * @propertyOf copernicus.controller:solicitudesContactoController
     * @description
     * Listado de solicitudes de contacto pendientes.
     *
     **/
    $scope.solicitudes;

    /**
     * @ngdoc method
     * @name error
     * @methodOf copernicus.controller:solicitudesContactoController
     * @description
     *
     * Muestra un mensaje de error debido a un problema con el servidor.
     *
     * @param {object} err Respuesta de la API REST.
     *
     **/
    function error(err){
        utils.mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
    }

    /**
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:solicitudesContactoController
     * @description
     * Inicializa el controlador, obteniendo las solicitudes de contacto pendientes del usuario.
     *
     **/
    var inicializacion = function(){
        $http({
            method: "GET",
            url: "api/solicitudesContacto"
        }).then(successSolicitudes, error);

        function successSolicitudes(res) {
            $scope.solicitudes = res.data;
        }

    }

    inicializacion();

    /**
     * @ngdoc method
     * @name aceptarSolicitud
     * @methodOf copernicus.controller:solicitudesContactoController
     * @description
     * Permite aceptar una solicitud de contacto.
     * @param {String} usernameMandoSolicitud Nombre de usuario del usuario que mando la solicitud de contacto.
     *
     **/
    $scope.aceptarSolicitud = function(usernameMandoSolicitud){

        $http({
            method: "POST",
            url: "api/aceptarSolicitud",
            data: {'usernameAceptado': usernameMandoSolicitud}
        }).then(solicitudAceptada, problemaAceptarSolicitud);


        eliminarSolicitud(usernameMandoSolicitud);

    }

    /**
     * @ngdoc method
     * @name solicitudAceptada
     * @methodOf copernicus.controller:solicitudesContactoController
     * @description
     * Muestra una notificación indicando que la solicitud fue aceptada
     * @param {object} res Respuesta de la API REST.
     *
     **/
    var solicitudAceptada = function(res){
        utils.mensajeSuccess($translate.instant("SOLICITUD_ACEPTADA"));
    }

    /**
     * @ngdoc method
     * @name problemaAceptarSolicitud
     * @methodOf copernicus.controller:solicitudesContactoController
     * @description
     * Muestra una notificación si hubo un problema al aceptar la solicitud.
     * @param {object} res Respuesta de la API REST.
     *
     **/
    var problemaAceptarSolicitud = function(res){
        utils.mensajeError($translate.instant("PROBLEMA_ACEPTAR_SOLICITUD"));
    }

    /**
     * @ngdoc method
     * @name ignorarSolicitud
     * @methodOf copernicus.controller:solicitudesContactoController
     * @description
     * Permite ignorar una solicitud de contacto.
     * @param {String} usernameMandoSolicitud Nombre de usuario del usuario que mando la solicitud de contacto.
     *
     **/
    $scope.ignorarSolicitud = function(usernameMandoSolicitud){

        $http({
            method: "POST",
            url: "api/ignorarSolicitud",
            data: {'usernameIgnorado': usernameMandoSolicitud}
        }).then(solicitudIgnorada);

        eliminarSolicitud(usernameMandoSolicitud);

    }

    /**
     * @ngdoc method
     * @name solicitudIgnorada
     * @methodOf copernicus.controller:solicitudesContactoController
     * @description
     * Muestra una notificación indicando que la solicitud fue ignorada.
     * @param {object} res Respuesta de la API REST.
     *
     **/
    var solicitudIgnorada = function(res){
        utils.mensajeSuccess($translate.instant("SOLICITUD_IGNORADA"));
    }

    /**
     * @ngdoc method
     * @name eliminarSolicitud
     * @methodOf copernicus.controller:solicitudesContactoController
     * @description
     * Elimina de la lista de solicitudes una solicitud que se acaba de aceptar o ignorar.
     * @param {String} username Nombre de usuario del usuario que mando la solicitud de contacto.
     *
     **/
    var eliminarSolicitud = function (username) {
        $scope.solicitudes.every(function (solicitud) {
            if (solicitud.contacto.username == username) {
                $scope.solicitudes.splice($scope.solicitudes.indexOf(solicitud), 1);
                return false;
            }
            return true;
        });
    }

    /**
     * @ngdoc method
     * @name cerrarPantallaSolicitudes
     * @methodOf copernicus.controller:solicitudesContactoController
     * @description
     *
     * Cierra el dialogo de las solicitudes refrescando la página. De este modo los usuarios cuya solicitud de contacto
     * fue aceptada aparecerán en el listado de contactos.
     *
     **/
    $scope.cerrarPantallaSolicitudes = function(){
        $window.location.reload();
    }


});