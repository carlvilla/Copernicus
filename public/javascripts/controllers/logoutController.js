var copernicus = angular.module('copernicus');

copernicus.controller('logoutController', function($scope, $cookies){

    $scope.logout = function(){
        $cookies.remove('token');
    }

});