/**
 * Created by carlosvillablanco on 24/03/2017.
 */
var copernicus = angular.module('copernicus');

copernicus.controller('salaController', function ($scope, $rootScope, $http, $window, utils, $translate) {

    $scope.foto;
    $scope.fotoRecortada = '';
    var fotoPorDefecto = true;
    var sizeMaxFoto = 8000000; //8MB

    //Variable necesario para el filtrado de sala
    var todasSalas;

    $http({
        method: "GET",
        url: "api/salasParticipa"
    }).then(success, error)

    function success(res) {
        $scope.salas = res.data;
        todasSalas = res.data;
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
        if (sala && sala.nombre) {
            utils.mensajeInfoSinTiempo($translate.instant("CREANDO_SALA"));

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
        } else {
            utils.mensajeError($translate.instant("NOMBRE_SALA_OBLIGATORIO"));
        }
    }

    var successCrear = function (res) {
        $window.location.href = '/personalPage';
    }

    $scope.contactos = {};
    $scope.contactosSeleccionados = [];

    $scope.addContactoTabla = function () {
        if ($scope.usuarioSeleccionado != undefined && comprobarLimiteSala()) {
            var usuario = $scope.usuarioSeleccionado.originalObject;

            //Si el usuario no se incluyó todavía
            if ($scope.contactosSeleccionados.indexOf(usuario) == -1)
                $scope.contactosSeleccionados.push(usuario);
        }
    }

    function comprobarLimiteSala() {
        //El límite es 8 personas, pero se comprueba que no haya más de 7 porque la octava persona es el usuario
        //que crea la sala
        if ($scope.contactosSeleccionados.length == 7) {
            utils.mensajeInfo($translate.instant("LIMITE_SALA"));
            return false;
        } else {
            return true;
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

        eliminarSolicitud(idSala);

    }


    $scope.ignorarSolicitud = function (idSala) {

        $http({
            method: "POST",
            url: "api/ignorarSolicitudSala",
            data: {'idSala': idSala}
        });

        eliminarSolicitud(idSala);

    }

    var eliminarSolicitud = function (idSala) {
        $scope.solicitudesSala.every(function (solicitud) {
            if (solicitud.idSala == idSala) {
                $scope.solicitudesSala.splice($scope.solicitudesSala.indexOf(solicitud), 1);
                return false;
            }
            return true;
        });
    }

    $scope.cerrarPantallaSolicitudes = function () {
        $window.location.reload();
    }

    var fotoSeleccionada = function (evt) {
        var size = document.getElementById('foto').files[0].size;

        if (size < sizeMaxFoto) {
            fotoPorDefecto = false;
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.foto = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        }
        else {
            utils.mensajeError($translate.instant("FOTO_SIZE_MAXIMO"));
        }

    };

    angular.element(document.querySelector('#foto')).on('change', fotoSeleccionada);

    function error(res) {
        //console.log(res);
    }

    $scope.filtrar = function () {
        $scope.salas = todasSalas.filter(function (sala) {
            var nombreSala = sala.nombre.toLowerCase();
            var stringFiltrar = $('#input-filtrar-salas').val().toLowerCase();
            return nombreSala.indexOf(stringFiltrar) !== -1;
        });
    }


});

