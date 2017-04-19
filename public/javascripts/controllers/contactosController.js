var webApp = angular.module('webApp');

webApp.controller('contactosController', function ($scope, $http) {

    $http({
        method: "GET",
        url: "api/contactos"
    }).then(successContactos, error);

    $http({
        method: "GET",
        url: "api/solicitudesContacto"
    }).then(successSolicitudes, error);

    function successContactos(res) {
        $scope.contactos = res.data;
    }

    function successSolicitudes(res) {
        $scope.solicitudes = res.data;
    }

    function error(){
        console.log("Ocurrió un error al recuperar los contactos");
    }

});
