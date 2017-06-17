/**
 * Created by carlosvillablanco on 29/02/2017.
 */
var copernicus = angular.module('copernicus');

copernicus.controller('loginController', function ($scope, $http, $cookies, $window, utils, $translate) {

    $scope.loginError = false;

    $scope.login = function () {
        //Obtenemos el usuario de la base de datos (Si existe)
        $http({
            method: "POST",
            url: "api/login",
            data: angular.toJson($scope.credenciales),
        }).then(success, error)
    }

    //Login correcto
    function success(res) {
        utils.mensajeSuccessSinTiempo($translate.instant('INICIANDO_SESION'));
        $cookies.put('token', res.data.token);
        $window.location.href = '/mainPage';
    }

    //La combinación usuario-contraseña es erronea
    function error(res) {
        $scope.loginError = true;
    }

});