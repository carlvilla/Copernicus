var webApp = angular.module('webApp');

webApp.controller('solicitudesContactoController', function ($scope, $http, $window) {

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

        $("#solicitud-de-"+usernameMandoSolicitud).remove();

    }


    $scope.ignorarSolicitud = function(usernameMandoSolicitud){

        $http({
            method: "POST",
            url: "api/ignorarSolicitud",
            data: {'usernameIgnorado': usernameMandoSolicitud}
        });

        $("#solicitud-de-"+usernameMandoSolicitud).remove();

    }

    $scope.cerrarPantallaSolicitudes = function(){
        $window.location.reload();
    }


});