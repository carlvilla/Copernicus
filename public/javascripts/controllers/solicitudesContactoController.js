var webApp = angular.module('webApp');

webApp.controller('solicitudesContactoController', function ($scope, $http) {

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

        //Username de la persona que acepta la solicitud

        $http({
            method: "POST",
            url: "api/aceptarSolicitud"
        });

        $("#solicitud-de-"+usernameMandoSolicitud).remove();

    }

    $scope.ignorarSolicitud = function(usernameMandoSolicitud){

        //Username de la persona que acepta la solicituds

        $http({
            method: "POST",
            url: "api/eliminarSolicitud"
        });

        $("#solicitud-de-"+usernameMandoSolicitud).remove();


    }


});