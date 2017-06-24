var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:ContactosController
 *
 * @description
 * Este controlador es utilizado para mostrar el listado de contactos, mostrar la información de los contactos
 * y bloquearlos
 */
copernicus.controller('contactosController', function ($scope, $http, $window, utils, $translate) {

    /**
     * @ngdoc property
     * @name contactos
     * @propertyOf copernicus.controller:ContactosController
     * @description
     * Variable necesario para el filtrado de contactos.
     *
     **/
    var contactos;

    /**
     * @ngdoc property
     * @name contactoSeleccionado
     * @propertyOf copernicus.controller:ContactosController
     * @description
     * Contacto seleccionado.
     *
     **/
    $scope.contactoSeleccionado;

    /**
     * @ngdoc property
     * @name textoFiltrar
     * @propertyOf copernicus.controller:ContactosController
     * @description
     * Texot para filtrar el listado de contactos.
     *
     **/
    $scope.textoFiltrar;

    function success(res) {
        $scope.contactos = res.data;
        contactos = res.data;
    }

    function error() {
        console.log("Ocurrió un error al recuperar los contactos");
    }

    /**
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:ContactosController
     * @description
     * Obtiene los contactos del usuario.
     *
     **/
    var inicializacion = function(){
        $http({
            method: "GET",
            url: "api/contactos"
        }).then(success, error);

    }

    inicializacion();

    /**
     * @ngdoc method
     * @name mostrarContacto
     * @methodOf copernicus.controller:ContactosController
     * @description
     * Muestra la información de un contacto seleccionado.
     *
     * @param {String} username Nombre de usuario del usuario cuya información se quiere mostrar.
     *
     **/
    $scope.mostrarContacto = function (username) {
        $http({
            method: "POST",
            url: "api/datosUsuario",
            data: {username: username}
        }).then(successMostrar);
    };

    /**
     * @ngdoc method
     * @name successMostrar
     * @methodOf copernicus.controller:ContactosController
     * @description
     * Obtiene de una respuesta de la API REST la información del contacto seleccionado.
     *
     * @param {object} res respuesta de la API REST
     *
     **/
    function successMostrar(res) {
        $scope.contactoSeleccionado = res.data;
    }

    /**
     * @ngdoc method
     * @name bloquearContacto
     * @methodOf copernicus.controller:ContactosController
     * @description
     * Bloquea a un contacto seleccionado.
     *
     * @param {String} username Nombre de usuario del contacto a bloquear.
     *
     **/
    $scope.bloquearContacto = function (username) {
        $http({
            method: "POST",
            url: "api/bloquearContacto",
            data: angular.toJson({username: username})
        }).then(successBloquear, errorBloquear);
    };

    /**
     * @ngdoc method
     * @name successBloquear
     * @methodOf copernicus.controller:ContactosController
     * @description
     * Muestra una notificación indicando que el usuario fue bloqueado y actualiza la página.
     *
     * @param {object} res respuesta de la API REST
     *
     **/
    function successBloquear(res) {
        utils.mensajeSuccessSinTiempo($translate.instant("USUARIO_BLOQUEADO"));
        $window.location.reload();
    }

    /**
     * @ngdoc method
     * @name successBloquear
     * @methodOf copernicus.controller:ContactosController
     * @description
     * Muestra una notificación indicando que hubo un error al bloquear al usuario.
     *
     **/
    function errorBloquear() {
        utils.mensajeError($translate.instant("ERROR_BLOQUEAR_CONTACTO"));
    }

    /**
     * @ngdoc method
     * @name successBloquear
     * @methodOf copernicus.controller:ContactosController
     * @description
     * Filtra el listado de contactos.
     *
     **/
    $scope.filtrar = function () {
        $scope.contactos = contactos.filter(function (contacto) {
            var nombreContacto = contacto.username.toLowerCase();
            var stringFiltrar =  $scope.textoFiltrar.toLowerCase();
            return nombreContacto.indexOf(stringFiltrar) !== -1;
        });
    }


});
