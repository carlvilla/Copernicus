/**
 * Created by carlosvillablanco on 24/03/2017.
 */
var webApp = angular.module('webApp');

webApp.controller('listSalasController', function($scope, $http, $cookies, $window){

    $http({
        method: "GET",
        url: "api/salasParticipa"
    }).then(success, error)


    function success(res) {
        $scope.salas = res.data;
    }

    function error(res) {
    }
});