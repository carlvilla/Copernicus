/**
 * Created by carlosvillablanco on 20/02/2017.
 */
var webApp = angular.module('webApp');

webApp.controller('registerController', function ($scope, $http, $window, $cookies) {
    $scope.messages = {};
    $scope.messages.showError = false;

    $scope.fotoPerfil;
    $scope.fotoRecortada = '';
    var fotoPorDefecto = true;

    $scope.registrar = function (usuario) {
        usuario.fotoPerfil = $scope.fotoRecortada;
        usuario.fotoPorDefecto = fotoPorDefecto;
        $http({
            method: "POST",
            url: "/api/register",
            data: angular.toJson(usuario)
        }).then(success, error);
    }

    var fotoSeleccionada = function (evt) {
        fotoPorDefecto = false;
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.fotoPerfil = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };

    angular.element(document.querySelector('#foto')).on('change', fotoSeleccionada);

    function success(res) {
        $scope.messages.showError = false;
        $cookies.put('token', res.data.token);
        $window.location.href = '/personalPage';
    }

    function error(res) {
        $scope.messages.showError = true;
    }

    $scope.comprobarCaracter = function (event) {
        if (event.which == 32) {
            event.preventDefault();
        }
    };

});