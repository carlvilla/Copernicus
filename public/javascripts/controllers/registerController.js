/**
 * Created by carlosvillablanco on 20/02/2017.
 */
var webApp = angular.module('webApp');

webApp.controller('registerController', function($scope, $http, $window, $cookies){
    $scope.messages = {};
    $scope.messages.showError = false;

    $scope.registrar = function (usuario) {
        $http({
            method: "POST",
            url: "/api/register",
            data: angular.toJson(usuario)
        }).then(success, error);
    }

    function success(res) {
        $scope.messages.showError = false;
        $cookies.put('token', res.data.token);
        $window.location.href = '/personalPage';
    }
    function error(res) {
        $scope.data.error = res.statusText + ' (' + res.status + ')';
        $scope.messages.showError = true;
    }
});