var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:bloquearContactoController
 *
 * @description
 * Este controlador es utilizado para bloquear y desbloquear contactos, además de listar los usuarios bloqueados.
 */
copernicus.controller('bloquearContactoController', function ($scope, $http, $window, utils, $translate) {

    /**
     * @ngdoc property
     * @name contactoSeleccionado
     * @propertyOf copernicus.controller:bloquearContactoController
     * @description
     * Contacto seleccionado para ser bloqueado.
     *
     **/
    $scope.contactoSeleccionado;

    /**
     * @ngdoc property
     * @name contactosBloqueados
     * @propertyOf copernicus.controller:bloquearContactoController
     * @description
     * Contactos bloqueados.
     *
     **/
    $scope.contactosBloqueados;

    /**
     * @ngdoc method
     * @name success
     * @methodOf copernicus.controller:bloquearContactoController
     * @description
     * Almacena en la propiedad 'contactosBloqueados' los usuarios bloqueados obtenidos a partir de una petición a la
     * API REST.
     *
     * @param {object} res Respuesta de la API REST
     *
     **/
    var success = function (res) {
        $scope.contactosBloqueados = res.data;
    }

    /**
     * @ngdoc method
     * @name error
     * @methodOf copernicus.controller:bloquearContactoController
     * @description
     * Muestra un mensaje de error en el caso de que no se pudo recuperar información al conectarse con el servidor.
     *
     * @param {object} res Respuesta de la API REST
     *
     **/
    var error = function (res) {
        utils.mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
    }

    /**
     * @ngdoc method
     * @name buscarContactosBloqueados
     * @methodOf copernicus.controller:bloquearContactoController
     * @description
     * Realiza petición a la API REST para recuperar los contactos bloqueados.
     *
     **/
    var buscarContactosBloqueados = function () {
        $http({
            method: "GET",
            url: "api/contactosBloqueados"
        }).then(success, error);
    }

    buscarContactosBloqueados();

    /**
     * @ngdoc method
     * @name buscarContactos
     * @methodOf copernicus.controller:bloquearContactoController
     * @description
     * Realiza petición a la API REST para recuperar los contactos del usuario.
     *
     **/
    var buscarContactos = function () {
        $http({
            method: "GET",
            url: "api/contactos"
        }).then(success, error);

        function success(res) {
            if (res.data != "") {
                $scope.contactos = res.data;
                $("#username-bloquear-contacto_value").prop("disabled", false);
                $("#username-bloquear-contacto_value").prop("placeholder", "Nombre de usuario");
            }
            else {
                $("#username-bloquear-contacto_value").prop("disabled", true);
                $("#username-bloquear-contacto_value").prop("placeholder", "No dispones de contactos para bloquear");
            }
        }
    }

    buscarContactos();

    /**
     * @ngdoc method
     * @name bloquearContacto
     * @methodOf copernicus.controller:bloquearContactoController
     * @description
     * Bloquea el contacto seleccionado.
     *
     **/
    $scope.bloquearContacto = function () {
        if ($scope.contactoSeleccionado) {

            var actualizarInput = function () {
                $("#username-bloquear-contacto_value").val('');
                $scope.contactoSeleccionado = undefined;
            }

            $http({
                method: "POST",
                url: "api/bloquearContacto",
                data: angular.toJson({username: ($scope.contactoSeleccionado.originalObject).username})
            }).then(function (res) {
                actualizarInput();
                buscarContactosBloqueados();
                buscarContactos();
            }, errorBloquear);
        }

    }

    /**
     * @ngdoc method
     * @name errorBloquear
     * @methodOf copernicus.controller:bloquearContactoController
     * @description
     *  Error producido cuando dos usuarios si bloquean entre sí a la vez
     *
     *  @param {object} err Respuesta de la API REST
     *
     **/
    var errorBloquear = function(err){
        utils.mensajeError($translate.instant('OPERACION_NO_AUTORIZADA'));
    }

    /**
     * @ngdoc method
     * @name desbloquearContacto
     * @methodOf copernicus.controller:bloquearContactoController
     * @description
     * Desbloquea al contacto seleccionado.
     *
     * @param {String} username Nombre de usuario del usuario que se va a desbloquear.
     *
     **/
    $scope.desbloquearContacto = function (username) {
        $http({
            method: "POST",
            url: "api/desbloquearContacto",
            data: angular.toJson({username: username})
        }).then(function (res) {
            buscarContactosBloqueados();
            buscarContactos();
        }, error);
    }

    /**
     * @ngdoc method
     * @name cerrarPantallaBloquear
     * @methodOf copernicus.controller:bloquearContactoController
     * @description
     * Actualiza la página al cerrar el diálogo para bloquear y desbloquear contactos.
     *
     **/
    $scope.cerrarPantallaBloquear = function () {
        $window.location.reload();
    }

});