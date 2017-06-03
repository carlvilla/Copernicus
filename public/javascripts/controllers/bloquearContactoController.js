var webApp = angular.module('webApp');

webApp.controller('bloquearContactoController', function ($scope, $http, $window) {

    $scope.usuarioSeleccionado;

    var success = function (res) {
        $scope.contactosBloqueados = res.data;
    }

    var error = function (res) {
        //console.log("Error al obtener contacto bloqueados");
    }

    var findContactosBloqueados = function () {
        $http({
            method: "GET",
            url: "api/contactosBloqueados"
        }).then(success, error);
    }

    findContactosBloqueados();

    var findContactos = function () {
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

    findContactos();

    $scope.bloquearContacto = function () {
        if ($scope.usuarioSeleccionado) {

            var actualizarInput = function () {
                $("#username-bloquear-contacto_value").val('');
                $scope.usuarioSeleccionado = undefined;
            }

            $http({
                method: "POST",
                url: "api/bloquearContacto",
                data: angular.toJson({username: ($scope.usuarioSeleccionado.originalObject).username})
            }).then(function (res) {
                actualizarInput();
                findContactosBloqueados();
                findContactos();
            }, error);
        }

    }

    $scope.desbloquearContacto = function (username) {
        $http({
            method: "POST",
            url: "api/desbloquearContacto",
            data: angular.toJson({username: username})
        }).then(function (res) {
            findContactosBloqueados();
            findContactos();
        }, error);
    }

    $scope.cerrarPantallaBloquear = function () {
        $window.location.reload();
    }

});