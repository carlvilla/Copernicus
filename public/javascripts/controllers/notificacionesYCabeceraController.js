var copernicus = angular.module('copernicus');

copernicus.controller('notificacionesYCabeceraController', function ($scope, $http, $cookies, utils, $translate) {

    function success(res) {
        if (res.data[0])
            $scope.usuario = res.data[0];
        else
            $scope.usuario = undefined;
    }

    function successSolicitudes(res) {
        $scope.solicitudes = res.data;
    }

    function successSala(res) {
        $scope.solicitudesSala = res.data;
    }

    function error(err) {
        utils.mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
    }

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
            }).then(success);
        }
    }

    inicializacion();


});
