var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:LoginController
 *
 * @description
 * Controlador encargado de permitir iniciar sesión a los usuarios.
 */
copernicus.controller('loginController', function ($scope, $http, $cookies, $window, utils, $translate) {

    /**
     * @ngdoc property
     * @name loginError
     * @propertyOf copernicus.controller:LoginController
     * @description
     * Atributo que indica si hay que mostrar un mensaje de error o no por un inicio de sesión no autorizado.
     *
     **/
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
        if(!utils.checkDatabaseError(res))
            $scope.loginError = true;
    }

});