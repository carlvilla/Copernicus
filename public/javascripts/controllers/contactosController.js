var webApp = angular.module('webApp');

webApp.controller('contactosController', function ($scope, $http) {

    $http({
        method: "GET",
        url: "api/contactos"
    }).then(success, error);

    function success(res) {
        $scope.contactos = res.data;
    }

    function error(){
        console.log("Ocurrió un error al recuperar los contactos");
    }

});
