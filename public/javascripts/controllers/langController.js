var webApp = angular.module('webApp');

webApp.controller('langController', function ($scope, $translate) {
    $scope.cambiarLenguaje = function (key) {
        $translate.use(key);
    }
});