var copernicus = angular.module('copernicus');

copernicus.controller('langController', function ($scope, $translate) {
    $scope.cambiarLenguaje = function (key) {
        $translate.use(key);
    }
});