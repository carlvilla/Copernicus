var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:loginController
 *
 * @description
 * Controlador encargado de permitir iniciar sesión a los usuarios.
 */
copernicus.controller('loginController', function ($scope, $http, $cookies, $window, utils, $translate) {

    /**
     * @ngdoc property
     * @name loginError
     * @propertyOf copernicus.controller:loginController
     * @description
     * Atributo que indica si hay que mostrar un mensaje de error o no por un inicio de sesión no autorizado.
     *
     **/
    $scope.loginError = false;

    /**
     * @ngdoc method
     * @name login
     * @methodOf copernicus.controller:loginController
     * @description
     * Permite iniciar sesión a un usuario.
     *
     **/
    $scope.login = function () {
        $http({
            method: "POST",
            url: "api/login",
            data: angular.toJson($scope.credenciales),
        }).then(success, error)
    }

    /**
     * @ngdoc method
     * @name success
     * @methodOf copernicus.controller:loginController
     * @description
     * Incluye el token de sesión al navegador y redirige al usuario a la página principal.
     *
     * @param {object} res Respuesta de la API REST
     *
     **/
    function success(res) {
        utils.mensajeSuccessSinTiempo($translate.instant('INICIANDO_SESION'));
        $cookies.put('token', res.data.token);
        $window.location.href = '/mainPage';
    }

    /**
     * @ngdoc method
     * @name error
     * @methodOf copernicus.controller:loginController
     * @description
     * Muestra un mensaje de error si las credenciales de acceso eran erroneas.
     *
     * @param {object} res Respuesta de la API REST
     *
     **/
    function error(res) {
        if(!utils.checkDatabaseError(res))
            $scope.loginError = true;
    }

});