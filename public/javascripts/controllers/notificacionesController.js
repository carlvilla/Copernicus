var webApp = angular.module('webApp');

webApp.controller('notificacionesController', function ($scope, $http) {

    $http({
        method: "GET",
        url: "api/solicitudesContacto"
    }).then(successSolicitudes, error);

    $http({
        method: "GET",
        url: "api/solicitudesSala"
    }).then(successSala, error);


    function successSolicitudes(res) {
        $scope.solicitudes = res.data;
    }

    function successSala(res) {
        $scope.solicitudesSala = res.data;
    }

    function error(err){
        //console.log(err);
    }

});
