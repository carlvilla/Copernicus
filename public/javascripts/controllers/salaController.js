var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:salaController
 *
 * @description
 * Este controlador está encargado de realizar varias gestiones referentes a las salas. Estas son la creación de salas,
 * aceptar o ignorar solicitudes de unión a salas, obtener el listado de salas en las que el usuario participa y
 * permitir su filtrado, y permitir a los usuarios acceder a las salas.
 *
 */
copernicus.controller('salaController', function ($scope, $rootScope, $http, $window, utils, $translate) {

    /**
     * @ngdoc property
     * @name foto
     * @propertyOf copernicus.controller:salaController
     * @description
     * Foto seleccionada por el usuario para la sala.
     *
     **/
    $scope.foto;

    /**
     * @ngdoc property
     * @name fotoRecortada
     * @propertyOf copernicus.controller:salaController
     * @description
     * Foto recortada por el usuario para la sala.
     *
     **/
    $scope.fotoRecortada = '';

    /**
     * @ngdoc property
     * @name fotoPorDefecto
     * @propertyOf copernicus.controller:salaController
     * @description
     * Booleano que indica si la foto que se asignará a una sala creada es la de por defecto.
     *
     **/
    var fotoPorDefecto = true;

    /**
     * @ngdoc property
     * @name sizeMaxFoto
     * @propertyOf copernicus.controller:salaController
     * @description
     * Entero que indica el tamaño máximo permitido de las fotos.
     *
     **/
    var sizeMaxFoto = 8000000; //8MB

    /**
     * @ngdoc property
     * @name contactos
     * @propertyOf copernicus.controller:salaController
     * @description
     * Contactos a mostrar en los campos con autocompletado.
     *
     **/
    $scope.contactos = [];

    /**
     * @ngdoc property
     * @name contactosSeleccionados
     * @propertyOf copernicus.controller:salaController
     * @description
     * Contactos que fueron seleccionados para mandarles una solicitud de unión durante la creación de una sala.
     *
     **/
    $scope.contactosSeleccionados = [];

    /**
     * @ngdoc property
     * @name creandoSala
     * @propertyOf copernicus.controller:salaController
     * @description
     * Booleano que indica si se esta intentando crear una sala.
     *
     **/
    $scope.creandoSala = false;

    /**
     * @ngdoc property
     * @name salasFiltrado
     * @propertyOf copernicus.controller:salaController
     * @description
     * Variable necesaria para el filtrado de sala
     *
     **/
    var salasFiltrado;

    /**
     * @ngdoc method
     * @name findContactos
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Encuentra los contactos del usuario para que les pueda mandar solicitudes de unión a una sala que cree.
     *
     **/
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
     * @ngdoc method
     * @name findSolicitudes
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Busca las solicitudes de unión a salas recibidas.
     *
     **/
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
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Inicializa el controlador, obteniendo las salas en las que participa el usuario y llamando a los métodos para
     * buscar a sus contactos y las solicitudes de unión a salas pendientes.
     *
     **/
    var inicializacion = function(){
        $http({
            method: "GET",
            url: "api/salasParticipa"
        }).then(success)

        function success(res) {
            $scope.salas = res.data;
            salasFiltrado = res.data;
        }

        findContactos();
        findSolicitudes();
    }

    inicializacion();

    /**
     * @ngdoc method
     * @name successAcceso
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Método invocado cuando el acceso a una sala es autorizado. Almacena la información de la sala en el
     * almacenamiento de la sesión, y redirige al usuario a la sala
     *
     * @param {object} res Respuesta de la API REST
     *
     **/
    function successAcceso(res) {
        window.sessionStorage.setItem("salaSeleccionada", JSON.stringify(res.data[0]));
        $window.location.href = '/chatroom';
    }

    /**
     * @ngdoc method
     * @name errorAcceso
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Método invocado cuando el acceso a una sala no es autorizado. Muestra un mensaje indicando que no se ha
     * autorizado el acceso a la sala.
     *
     * @param {object} res Respuesta de la API REST
     *
     **/
    function errorAcceso(res){
        utils.mensajeError($translate.instant('ACCESO_SALA_NO_AUTORIZADO'));
    }

    /**
     * @ngdoc method
     * @name comprobarLimiteSala
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Comprueba que no se supera el límite de una sala.
     *
     **/
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
     * @ngdoc method
     * @name eliminarSolicitud
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Elimina una solicitud de unión de una sala que está siendo creada.
     *
     * @param {String} idSala ID de la sala de la cual se elimina la solicitud de unión.
     *
     **/
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
     * @ngdoc method
     * @name successCrear
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Invocado cuando una sala fue creada con éxito. Redirige al usuario a la página principal.
     *
     * @param {object} res Respuesta de la API REST.
     *
     **/
    var successCrear = function (res) {
        $scope.creandoSala = false;
        $window.location.href = '/mainPage';
    }

    /**
     * @ngdoc method
     * @name nombreNoValido
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Invocado cuando el nombre de la sala no es válido.
     *
     **/
    var nombreNoValido = function () {
        utils.mensajeError($translate.instant("NOMBRE_SALA_MAX"));
    }

    /**
     * @ngdoc method
     * @name descripcionNoValida
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Invocado cuando la descripción de la sala no es válido. Muestra una notificación indicando que la descripción
     * es demasiado larga.
     *
     **/
    var descripcionNoValida = function () {
        utils.mensajeError($translate.instant("DESCRIPCION_SALA_MAX"));
    }

    /**
     * @ngdoc method
     * @name accederSala
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Permite el acceso a las salas.
     *
     * @param {String} idSala ID de la sala a la que se quiere acceder.
     *
     **/
    $scope.accederSala = function (idSala) {
        $http({
            method: "POST",
            url: "api/salas",
            data: angular.toJson({idSala: idSala})
        }).then(successAcceso, errorAcceso)
    }

    /**
     * @ngdoc method
     * @name errorCrear
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Invocado si ocurre un error al crear la sala por problemas en el servidor. Muestra un mensaje indicando que
     * se intente de nuevo más tarde.
     *
     **/
    var errorCrear = function (err) {
        $scope.creandoSala = false;
        utils.mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
    }

    /**
     * @ngdoc method
     * @name crearSala
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Comprueba que los valores introducidos para crear la sala sean válido y, si es así, la crea.
     *
     * @param {object} sala Contiene la información de la sala.
     *
     **/
    $scope.crearSala = function (sala) {
        if (sala && sala.nombre) {

            if (sala.nombre.length > 50) {
                nombreNoValido();
                return;
            } else if (sala.descripcion && sala.descripcion.length > 200) {
                descripcionNoValida();
                return;
            }

            utils.mensajeInfoSinTiempo($translate.instant("CREANDO_SALA"));

            sala.foto = $scope.fotoRecortada;
            sala.fotoPorDefecto = fotoPorDefecto;

            $scope.creandoSala = true;

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
     * @ngdoc method
     * @name addContacto
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Añade el contacto seleccionado a la tabla de usuarios a los que se enviará una solicitud de unión para
     * la sala creada.
     *
     **/
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
     * @ngdoc method
     * @name eliminarSeleccionado
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Elimina al usuario de aquellos a los que se enviará una solicitud de unión a la sala que se está creando.
     *
     * @param {String} username Nombre de usuario del usuario el cual se eliminará de aquellos a los que se envirá una
     * solicitud de unión a una sala que se está creando.
     *
     **/
    $scope.eliminarSeleccionado = function (username) {
        $scope.contactosSeleccionados.forEach(function (usuario) {
            if (usuario.username == username) {
                var index = $scope.contactosSeleccionados.indexOf(usuario);
                $scope.contactosSeleccionados.splice(index, 1);
            }
        });
    }

    /**
     * @ngdoc method
     * @name aceptarSolicitud
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Acepta una solicitud a una sala
     *
     * @param {String} idSala ID de la sala cuya solicitud de unión fue aceptada por el usuario.
     **/
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
     * @ngdoc method
     * @name ignorarSolicitud
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Ignora una solicitud a una sala
     *
     * @param {String} idSala ID de la sala cuya solicitud de unión fue ignorada por el usuario.
     **/
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
     * @ngdoc method
     * @name cerrarPantallaSolicitudes
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Cierra la pantalla de solicitudes refrescando la página.
     *
     **/
    $scope.cerrarPantallaSolicitudes = function () {
        $window.location.reload();
    }

    /**
     * @ngdoc method
     * @name fotoSeleccionada
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Obtiene la foto seleccionada por el usuario para la sala creada.
     *
     * @param {object} evt Contiene la foto seleccionada.
     *
     **/
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
     * @ngdoc method
     * @name filtrar
     * @methodOf copernicus.controller:salaController
     * @description
     *
     * Filtra el listado de salas
     *
     **/
    $scope.filtrar = function () {
        $scope.salas = salasFiltrado.filter(function (sala) {
            var nombreSala = sala.nombre.toLowerCase();
            var stringFiltrar = $('#input-filtrar-salas').val().toLowerCase();
            return nombreSala.indexOf(stringFiltrar) !== -1;
        });
    }

});

