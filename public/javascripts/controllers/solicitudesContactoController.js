var copernicus = angular.module('copernicus');

copernicus.controller('solicitudesContactoController', function ($scope, $http, $window) {

    $http({
        method: "GET",
        url: "api/solicitudesContacto"
    }).then(successSolicitudes, error);

    function successSolicitudes(res) {
        $scope.solicitudes = res.data;
    }

    function error(err){
        //console.log(err);
    }

    $scope.aceptarSolicitud = function(usernameMandoSolicitud){

        $http({
            method: "POST",
            url: "api/aceptarSolicitud",
            data: {'usernameAceptado': usernameMandoSolicitud}
        });

        eliminarSolicitud(usernameMandoSolicitud);

    }

    $scope.ignorarSolicitud = function(usernameMandoSolicitud){

        $http({
            method: "POST",
            url: "api/ignorarSolicitud",
            data: {'usernameIgnorado': usernameMandoSolicitud}
        });

        eliminarSolicitud(usernameMandoSolicitud);

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