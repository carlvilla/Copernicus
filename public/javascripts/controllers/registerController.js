/**
 * Created by carlosvillablanco on 20/02/2017.
 */
var copernicus = angular.module('copernicus');

copernicus.controller('registerController', function ($scope, $http, $window, $cookies, utils, $translate) {
    $scope.messages = {};
    $scope.messages.showError = false;

    $scope.fotoPerfil;
    $scope.fotoRecortada = '';
    var fotoPorDefecto = true;
    var sizeMaxFoto = 8000000; //8MB

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
        var size = document.getElementById('foto').files[0].size;

        if(size < sizeMaxFoto) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.fotoPerfil = evt.target.result;
                });

                fotoPorDefecto = false;
            };
            reader.readAsDataURL(file);
        }else{
            utils.mensajeError($translate.instant("FOTO_SIZE_MAXIMO"));
        }
    };

    angular.element(document.querySelector('#foto')).on('change', fotoSeleccionada);

    function success(res) {
        $scope.messages.showError = false;
        $cookies.put('token', res.data.token);
        $window.location.href = '/mainPage';
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