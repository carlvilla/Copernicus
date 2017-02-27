/**
 * Created by carlosvillablanco on 20/02/2017.
 */
var myApp = angular.module('myApp', []);

myApp.controller('registerController', function($scope, $http, $window){
    $scope.messages = {};
    $scope.messages.showError = false;

    var $cookies;
    angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
        $cookies = _$cookies_;
    }]);

    $scope.registrar = function (usuario) {
        $http({
            method: "POST",
            url: "/api/register",
            data: angular.toJson(usuario)
        }).then(success, error);
    }

    function success(res) {
        $scope.data.errorShow = false;
        $cookies.put('token', res.data.token);
        $window.location.href = '/personalPage';
    }
    function error(res) {
        $scope.data.error = res.statusText + ' (' + res.status + ')';
        $scope.data.errorShow = true;
    }
});