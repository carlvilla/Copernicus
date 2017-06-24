var copernicus = angular.module('copernicus');

copernicus.controller('salaController', function ($scope, $rootScope, $http, $window, utils, $translate) {

    $scope.foto;
    $scope.fotoRecortada = '';
    var fotoPorDefecto = true;
    var sizeMaxFoto = 8000000; //8MB

    //Contactos a mostrar en el autocompletar
    $scope.contactos = {};

    //Contactos seleccionados para añadir a la sala
    $scope.contactosSeleccionados = [];

    //Variable necesario para el filtrado de sala
    var salas;
    
    /**
     * Encuentar los contactos del usuario para que los pueda añadir a la sala
     */
    var findContactos = function () {
        $http({
            method: "GET",
            url: "api/contactos"
        }).then(success);

        function success(res) {
            if (!(res.data == "")) {
                $scope.contactos = res.data;
            }
        }
    }

    /**
     * Busca las solicitudes de unión a salas recibidas
     */
    var findSolicitudes = function(){
        $http({
            method: "GET",
            url: "api/solicitudesSala"
        }).then(successSolicitudes);

        function successSolicitudes(res) {
            $scope.solicitudesSala = res.data;
        }

    }

    /**
     * Obtiene las salas en las que participa el usuario. Es necesario para mostrarle su listado de salas.
     */
    var inicializacion = function(){
        $http({
            method: "GET",
            url: "api/salasParticipa"
        }).then(success)

        function success(res) {
            $scope.salas = res.data;
            salas = res.data;
        }

        findContactos();
        findSolicitudes();
    }

    inicializacion();

    /**
     * El usuario tiene permiso para acceder a la sala
     *
     * @param res
     */
    function successAcceso(res) {
        window.sessionStorage.setItem("salaSeleccionada", JSON.stringify(res.data[0]));
        $window.location.href = '/chatroom';
    }

    /**
     * El usuario no ha podido acceder a la sala
     * @param res
     */
    function errorAcceso(res){
        utils.mensajeError($translate.instant('ACCESO_SALA_NO_AUTORIZADO'));
    }


    /**
     * Comprueba que no se supera el límite de una sala
     * @returns {boolean}
     */
    function comprobarLimiteSala() {
        //El límite es 4 personas, pero se comprueba que no haya más de 3 porque la octava persona es el usuario
        //que crea la sala
        if ($scope.contactosSeleccionados.length == 3) {
            utils.mensajeInfo($translate.instant("LIMITE_SALA"));
            return false;
        } else {
            return true;
        }
    }

    /**
     * Elimina una solicitud de una sala
     * @param idSala
     */
    var eliminarSolicitud = function (idSala) {
        $scope.solicitudesSala.every(function (solicitud) {
            if (solicitud.idSala == idSala) {
                $scope.solicitudesSala.splice($scope.solicitudesSala.indexOf(solicitud), 1);
                return false;
            }
            return true;
        });
    }

    /**
     * Función llamada cuando una sala fue creada con éxito
     * @param res
     */
    var successCrear = function (res) {
        $window.location.href = '/mainPage';
    }


    /**
     * Función llamada cuando el nombre de la sala no es válido
     */
    var nombreNoValido = function () {
        utils.mensajeError($translate.instant("NOMBRE_SALA_MAX"));
    }

    /**
     * Función llamada cuando la descripción de la sala no es válido
     */
    var descripcionNoValida = function () {
        utils.mensajeError($translate.instant("DESCRIPCION_SALA_MAX"));
    }

    /**
     * Función llamada para acceder a una sala
     * @param idSala
     */
    $scope.accederSala = function (idSala) {
        $http({
            method: "POST",
            url: "api/salas",
            data: angular.toJson({idSala: idSala})
        }).then(successAcceso, errorAcceso)
    }

    /**
     * Ocurrió un error al crear la sala por problemas en el servidor
     * @param err
     */
    var errorCrear = function (err) {
        utils.mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
    }

    /**
     * Comprueba que los valores introducidos para crear la sala sean válido, y en ese caso la crea
     * @param sala
     */
    $scope.crearSala = function (sala) {
        if (sala && sala.nombre) {

            if (sala.nombre.length > 50) {
                nombreNoValido();
                return;
            } else if (sala.descripcion > 200) {
                utils.mensajeError($translate.instant("DESCRIPCION_SALA_MAX"));
                return;
            }

            utils.mensajeInfoSinTiempo($translate.instant("CREANDO_SALA"));

            sala.foto = $scope.fotoRecortada;
            sala.fotoPorDefecto = fotoPorDefecto;
            $http({
                method: "POST",
                url: "api/crearSala",
                data: angular.toJson(
                    {
                        "sala": sala,
                        "usuarios": $scope.contactosSeleccionados
                    }
                )
            }).then(successCrear, errorCrear);
        } else {
            utils.mensajeError($translate.instant("NOMBRE_SALA_OBLIGATORIO"));
        }
    }

    /**
     * Añade el contacto seleccionado a la tabla de usuarios a los que se enviará una solicitud de unión a la sala creada
     */
    $scope.addContacto = function () {

        if ($scope.usuarioSeleccionado != undefined) {
            if (comprobarLimiteSala()) {
                var usuario = $scope.usuarioSeleccionado.originalObject;

                //Si el usuario no se incluyó todavía
                if ($scope.contactosSeleccionados.indexOf(usuario) == -1)
                    $scope.contactosSeleccionados.push(usuario);
            }
        } else {
            utils.mensajeError($translate.instant('SELECCIONAR_CONTACTO_LISTADO'));
        }


    }

    /**
     * Elimina al usuario de los usuarios a los que se enviará una solicitud de unión a la sala creada
     * @param username
     */
    $scope.eliminarSeleccionado = function (username) {
        $scope.contactosSeleccionados.forEach(function (usuario) {
            if (usuario.username == username) {
                var index = $scope.contactosSeleccionados.indexOf(usuario);
                $scope.contactosSeleccionados.splice(index, 1);
            }
        });
    }

    /**
     * Acepta una solicitud a una sala
     *
     * @param idSala
     */
    $scope.aceptarSolicitud = function (idSala) {

        $http({
            method: "POST",
            url: "api/aceptarSolicitudSala",
            data: {'idSala': idSala}
        }).then(function (res) {
            utils.mensajeSuccess($translate.instant("SOLICITUD_ACEPTADA"));
        }, function (res) {
            utils.mensajeError($translate.instant("PROBLEMA_ACEPTAR_SOLICITUD"));
        })

        eliminarSolicitud(idSala);

    }

    /**
     * Ignora una solicitud a una sala
     *
     * @param idSala
     */
    $scope.ignorarSolicitud = function (idSala) {
        $http({
            method: "POST",
            url: "api/ignorarSolicitudSala",
            data: {'idSala': idSala}
        }).then(function (res) {
            utils.mensajeSuccess($translate.instant("SOLICITUD_IGNORADA"));
        });

        eliminarSolicitud(idSala);
    }

    /**
     * Cierra la pantalla de solicitudes refrescando la página por si se aceptó alguna
     */
    $scope.cerrarPantallaSolicitudes = function () {
        $window.location.reload();
    }

    /**
     * Obtiene la foto seleccionada por el usuario para la sala
     * @param evt
     */
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

    /**
     * Filtra el listado de salas
     */
    $scope.filtrar = function () {
        $scope.salas = salas.filter(function (sala) {
            var nombreSala = sala.nombre.toLowerCase();
            var stringFiltrar = $('#input-filtrar-salas').val().toLowerCase();
            return nombreSala.indexOf(stringFiltrar) !== -1;
        });
    }


});

