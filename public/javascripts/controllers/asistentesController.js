var webApp = angular.module('webApp');

webApp.controller('asistentesController', function ($scope, $http, $cookies, webSocketService) {

    $http({
        method: "GET",
        url: "api/profile"
    }).then(success, error);

    function success(res) {

            var usuario = res.data[0];

            webSocketService.asistentesManager.addAsistente(usuario);

            var asistentes = webSocketService.asistentesManager.getAsistentes();

            asistentes.splice(asistentes.indexOf(usuario),1);

            $scope.asistentes = asistentes;
        };

        function error(res) {
            console.log(res);
        };

});


