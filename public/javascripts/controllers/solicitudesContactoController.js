var copernicus = angular.module('copernicus');

copernicus.controller('solicitudesContactoController', function ($scope, $http, $window, utils, $translate) {


    function error(err){
        utils.mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
    }

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

    $scope.aceptarSolicitud = function(usernameMandoSolicitud){

        $http({
            method: "POST",
            url: "api/aceptarSolicitud",
            data: {'usernameAceptado': usernameMandoSolicitud}
        }).then(solicitudAceptada, problemaAceptarSolicitud);


        eliminarSolicitud(usernameMandoSolicitud);

    }

    /**
     * Muestra una notificación indicando que la solicitud fue aceptada
     *
     * @param res
     */
    var solicitudAceptada = function(res){
        utils.mensajeSuccess($translate.instant("SOLICITUD_ACEPTADA"));
    }

    /**
     * Muestra una notificación si hubo un problema al aceptar la solicitud
     *
     * @param res
     */
    var problemaAceptarSolicitud = function(res){
        utils.mensajeError($translate.instant("PROBLEMA_ACEPTAR_SOLICITUD"));
    }

    $scope.ignorarSolicitud = function(usernameMandoSolicitud){

        $http({
            method: "POST",
            url: "api/ignorarSolicitud",
            data: {'usernameIgnorado': usernameMandoSolicitud}
        }).then(solicitudIgnorada);

        eliminarSolicitud(usernameMandoSolicitud);

    }

    /**
     * Muestra una notificación indicando que la solicitud fue ignorada
     *
     * @param res
     */
    var solicitudIgnorada = function(res){
        utils.mensajeSuccess($translate.instant("SOLICITUD_IGNORADA"));
    }



    var eliminarSolicitud = function (username) {
        $scope.solicitudes.every(function (solicitud) {
            if (solicitud.contacto.username == username) {
                $scope.solicitudes.splice($scope.solicitudes.indexOf(solicitud), 1);
                return false;
            }
            return true;
        });
    }

    $scope.cerrarPantallaSolicitudes = function(){
        $window.location.reload();
    }


});