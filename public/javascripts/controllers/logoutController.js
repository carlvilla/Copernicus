/**
 * Created by carlosvillablanco on 26/03/2017.
 */
var webApp = angular.module('webApp');

webApp.controller('logoutController', function($scope, $cookies){

    $scope.logout = function(){
        $cookies.remove('token');
    }

});