var webApp = angular.module('webApp');

webApp.controller('gestionarSalasController', function ($scope, $http, growl) {

    var idSalaSeleccionada;

    function error(res) {
        //console.log("Error al obtener las salas en las que el usuario es administrador o moderador");
    }

    $http({
        method: "GET",
        url: "api/salasAdmin"
    }).then(function (res) {
        $scope.salasAdmin = res.data;
    }, error)

    $http({
        method: "GET",
        url: "api/salasModerador"
    }).then(function (res) {
        $scope.salasModerador = res.data;
    }, error)

    $scope.mostrarInfoSala = function (idSala, admin) {
        idSalaSeleccionada = idSala;
        if (admin) {
            ($scope.salasAdmin).forEach(function (sala) {
                if (sala.idSala == idSala) {
                    $scope.salaSeleccionada = sala;
                    console.log($scope.salaSeleccionada);
                }
            })

        } else {
            $scope.salasModerador.every(function (sala) {
                if (sala.idSala == idSala) {
                    $scope.salaSeleccionada = sala;
                }
            })
        }

        $http({
            method: "POST",
            url: "api/participantesSala",
            data: {idSala: idSala}
        }).then(function (res) {
            console.log(res.data);
            $scope.participantes = res.data;
            $scope.admin = admin;
        }, error)
    };

    var mostrarMensaje = function (res) {
        growl.success("Datos de la sala actualizados", {ttl: 4000});
    }

    $scope.actualizarSala = function () {
        $http({
            method: "POST",
            url: "api/actualizarSala",
            data: {
                idSala: idSalaSeleccionada,
                nombre: $scope.salaSeleccionada.nombre,
                descripcion: $scope.salaSeleccionada.descripcion
            }
        }).then(mostrarMensaje, error);
    }

});