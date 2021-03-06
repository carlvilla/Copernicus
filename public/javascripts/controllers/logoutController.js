var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:logoutController
 *
 * @description
 * Este controlador es utilizado para cerrar sesión.
 */
copernicus.controller('logoutController', function($scope, $cookies){

    /**
     * @ngdoc method
     * @name logout
     * @methodOf copernicus.controller:logoutController
     * @description
     * Elimina el token de sesión.
     *
     **/
    $scope.logout = function(){
        $cookies.remove('token');
    }

});