/**
 * Created by carlosvillablanco on 26/03/2017.
 */
var copernicus = angular.module('copernicus');

copernicus.controller('logoutController', function($scope, $cookies){

    $scope.logout = function(){
        $cookies.remove('token');
    }

});