var copernicus = angular.module('copernicus');

copernicus.controller('bloquearContactoController', function ($scope, $http, $window, utils, $translate) {

    $scope.contactoSeleccionado;

    var success = function (res) {
        $scope.contactosBloqueados = res.data;
    }

    var error = function (res) {
        utils.mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
    }

    var buscarContactosBloqueados = function () {
        $http({
            method: "GET",
            url: "api/contactosBloqueados"
        }).then(success, error);
    }

    buscarContactosBloqueados();

    var buscarContactos = function () {
        $http({
            method: "GET",
            url: "api/contactos"
        }).then(success, error);

        function success(res) {
            if (res.data != "") {
                $scope.contactos = res.data;
                $("#username-bloquear-contacto_value").prop("disabled", false);
                $("#username-bloquear-contacto_value").prop("placeholder", "Nombre de usuario");
            }
            else {
                $("#username-bloquear-contacto_value").prop("disabled", true);
                $("#username-bloquear-contacto_value").prop("placeholder", "No dispones de contactos para bloquear");
            }
        }
    }

    buscarContactos();

    $scope.bloquearContacto = function () {
        if ($scope.contactoSeleccionado) {

            var actualizarInput = function () {
                $("#username-bloquear-contacto_value").val('');
                $scope.contactoSeleccionado = undefined;
            }

            $http({
                method: "POST",
                url: "api/bloquearContacto",
                data: angular.toJson({username: ($scope.contactoSeleccionado.originalObject).username})
            }).then(function (res) {
                actualizarInput();
                buscarContactosBloqueados();
                buscarContactos();
            }, errorBloquear);
        }

    }

    /**
     * Error producido cuando dos usuarios si bloquean entre sí a la vez
     *
     * @param err
     */
    var errorBloquear = function(err){
        utils.mensajeError($translate.instant('OPERACION_NO_AUTORIZADA'));
    }

    $scope.desbloquearContacto = function (username) {
        $http({
            method: "POST",
            url: "api/desbloquearContacto",
            data: angular.toJson({username: username})
        }).then(function (res) {
            buscarContactosBloqueados();
            buscarContactos();
        }, error);
    }

    $scope.cerrarPantallaBloquear = function () {
        $window.location.reload();
    }

});