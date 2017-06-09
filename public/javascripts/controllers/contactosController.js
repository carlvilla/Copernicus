var webApp = angular.module('webApp');

webApp.controller('contactosController', function ($scope, $http, $window, utils, $translate) {

    //Atributo necesario para el filtrado de contactos
    var todosContactos;

    $http({
        method: "GET",
        url: "api/contactos"
    }).then(success, error);

    function success(res) {
        $scope.contactos = res.data;
        todosContactos = res.data;
    }

    function error() {
        console.log("Ocurrió un error al recuperar los contactos");
    }

    $scope.mostrarContacto = function (username) {
        $http({
            method: "POST",
            url: "api/datosUsuario",
            data: {username: username}
        }).then(successMostrar, errorMostrar);
    };

    function successMostrar(res) {
        $scope.contactoSeleccionado = res.data;
    }

    function errorMostrar() {
        console.log("Ocurrió un error al los datos del contactos");
    }

    $scope.bloquearContacto = function (username) {
        $http({
            method: "POST",
            url: "api/bloquearContacto",
            data: angular.toJson({username: username})
        }).then(successBloquear, errorBloquear);
    };

    function successBloquear(res) {
        utils.mensajeSuccessSinTiempo($translate.instant("USUARIO_BLOQUEADO"));
        $window.location.reload();
    }

    function errorBloquear() {
        utils.mensajeError($translate.instant("ERROR_BLOQUEAR_CONTACTO"));
    }

    $scope.filtrar = function () {
        $scope.contactos = todosContactos.filter(function (contacto) {
            var nombreContacto = contacto.username.toLowerCase();
            var stringFiltrar = $('#input-filtrar-contactos').val().toLowerCase();
            return nombreContacto.indexOf(stringFiltrar) !== -1;
        });
    }


});
