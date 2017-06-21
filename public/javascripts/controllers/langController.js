var copernicus = angular.module('copernicus');

copernicus.controller('langController', function ($scope, $translate) {
    $scope.cambiarIdioma = function (key) {
        $translate.use(key);
    }
});