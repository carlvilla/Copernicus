var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:langController
 *
 * @description
 * Este controlador es utilizado para permitir cambiar el idioma de la aplicación.
 */
copernicus.controller('langController', function ($scope, $translate) {

    /**
     * @ngdoc method
     * @name cambiarIdioma
     * @methodOf copernicus.controller:langController
     * @description
     * Permite cambiar el idioma de la aplicación.
     *
     * @param {String} key Clave del idioma al que se cambia la aplicación.
     *
     **/
    $scope.cambiarIdioma = function (key) {
        $translate.use(key);
    }

});