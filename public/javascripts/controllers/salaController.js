/**
 * Created by carlosvillablanco on 24/03/2017.
 */
var webApp = angular.module('webApp');

webApp.controller('salaController', function ($scope, $rootScope ,$http, $window) {

    $scope.foto;
    $scope.fotoRecortada = '';
    var fotoPorDefecto = true;

    $http({
        method: "GET",
        url: "api/salasParticipa"
    }).then(success, error)


    function success(res) {
        $scope.salas = res.data;
    }

    $scope.accederSala = function (idSala) {
        $http({
            method: "POST",
            url: "api/salas",
            data: angular.toJson({idSala: idSala})
        }).then(successAcceso, error)
    }

    function successAcceso(res) {
        window.sessionStorage.setItem("salaSeleccionada", JSON.stringify(res.data[0]));
        $window.location.href = '/chatroom';
    }

    //Crear sala
    $scope.crearSala = function (sala) {
        sala.foto = $scope.fotoRecortada;
        sala.fotoPorDefecto = fotoPorDefecto;
        $http({
            method: "POST",
            url: "api/createSala",
            data: angular.toJson(
                {
                    "sala": sala,
                    "usuarios": $scope.contactosSeleccionados
                }
            )
        }).then(successCrear, error);
    }

    var successCrear = function (res) {
        $window.location.href = '/personalPage';
    }

    $scope.contactos = {};
    $scope.contactosSeleccionados = [];

    $scope.addContactoTabla = function () {
        if ($scope.usuarioSeleccionado != undefined) {
            var usuario = $scope.usuarioSeleccionado.originalObject;

            //Si el usuario no se incluyó todavía
            if ($scope.contactosSeleccionados.indexOf(usuario) == -1)
                $scope.contactosSeleccionados.push(usuario);
        }
    }

    $scope.eliminarSeleccionado = function (username) {
        $scope.contactosSeleccionados.forEach(function (usuario) {
            if (usuario.username == username) {
                var index = $scope.contactosSeleccionados.indexOf(usuario);
                $scope.contactosSeleccionados.splice(index, 1);
            }
        });
    }

    var findContactos = function () {
        $http({
            method: "GET",
            url: "api/contactos"
        }).then(success, error);

        function success(res) {
            if (!(res.data == "")) {
                $scope.contactos = res.data;
            }
        }

        function error(res) {
            console.log(res);
        }
    }

    findContactos();

    //Fin crear sala

    //Solicitudes para unirse a sala
    $http({
        method: "GET",
        url: "api/solicitudesSala"
    }).then(successSolicitudes, error);

    function successSolicitudes(res) {
        $scope.solicitudesSala = res.data;
    }

    $scope.aceptarSolicitud = function (idSala) {

        $http({
            method: "POST",
            url: "api/aceptarSolicitudSala",
            data: {'idSala': idSala}
        });

        $("#solicitud-de-" + idSala).remove();

    }


    $scope.ignorarSolicitud = function (idSala) {

        $http({
            method: "POST",
            url: "api/ignorarSolicitudSala",
            data: {'idSala': idSala}
        });

        $("#solicitud-de-" + idSala).remove();

    }

    $scope.cerrarPantallaSolicitudes = function () {
        $window.location.reload();
    }

    //Fin solicitudes para unirse a sala

    var fotoSeleccionada = function (evt) {
        fotoPorDefecto = false;
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.foto = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };

    angular.element(document.querySelector('#foto')).on('change', fotoSeleccionada);

    function error(res) {
        //console.log(res);
    }

});

