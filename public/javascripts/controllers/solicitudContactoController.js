/**
 * Created by carlosvillablanco on 19/04/2017.
 */

var webApp = angular.module('webApp');

webApp.controller('solicitudContactoController', function ($scope, $http) {

    $http({
        method: "GET",
        url: "api/findPosiblesContactos"
    }).then(success, error);

    function success(res){
        $scope.usernames = res.data;
    }

    function error(res) {
        console.log(res);
    }

});