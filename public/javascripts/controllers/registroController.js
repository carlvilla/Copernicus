var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:registroController
 *
 * @description
 * Este controlador permite a un usuario registrarse.
 */
copernicus.controller('registroController', function ($scope, $http, $window, $cookies, utils, $translate) {

    /**
     * @ngdoc property
     * @name foto
     * @propertyOf copernicus.controller:registroController
     * @description
     * Foto seleccionada por el usuario.
     *
     **/
    $scope.foto;

    /**
     * @ngdoc property
     * @name fotoRecortada
     * @propertyOf copernicus.controller:registroController
     * @description
     * Parte seleccionada por el usuario de la foto que subió.
     *
     **/
    $scope.fotoRecortada = '';

    /**
     * @ngdoc property
     * @name fotoPorDefecto
     * @propertyOf copernicus.controller:registroController
     * @description
     * Booleano que indica si se va a utilizar como foto de perfil la foto por defecto.
     *
     **/
    var fotoPorDefecto = true;

    /**
     * @ngdoc property
     * @name sizeMaxFoto
     * @propertyOf copernicus.controller:registroController
     * @description
     * Entero que indica el tamaño máximo permitido de las fotos.
     *
     **/
    var sizeMaxFoto = 8000000; //8MB

    /**
     * @ngdoc property
     * @name messages
     * @propertyOf copernicus.controller:registroController
     * @description
     * Atributo utilizado para mostrar mensajes de error.
     *
     **/
    $scope.messages = {};

    $scope.messages.showError = false;

    /**
     * @ngdoc method
     * @name registrar
     * @methodOf copernicus.controller:registroController
     * @description
     * Registra a un usuario en el sistema.
     *
     * @param {object} usuario Datos del usuario que se quiere registrar.
     *
     **/
    $scope.registrar = function (usuario) {
        utils.mensajeInfo($translate.instant("SOLICITANDO_REGISTRO"));
        usuario.foto = $scope.fotoRecortada;
        usuario.fotoPorDefecto = fotoPorDefecto;
        $http({
            method: "POST",
            url: "/api/registrar",
            data: angular.toJson(usuario)
        }).then(success, error);
    }

    /**
     * @ngdoc method
     * @name fotoSeleccionada
     * @methodOf copernicus.controller:registroController
     * @description
     * Obtiene la foto seleccionada por el usuario.
     *
     * @param {object} evt Contiene la foto seleccionada por el usuario.
     *
     **/
    var fotoSeleccionada = function (evt) {
        var size = document.getElementById('foto').files[0].size;

        if (size < sizeMaxFoto) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.foto = evt.target.result;
                });

                fotoPorDefecto = false;
            };
            reader.readAsDataURL(file);
        } else {
            utils.mensajeError($translate.instant("FOTO_SIZE_MAXIMO"));
        }
    };

    angular.element(document.querySelector('#foto')).on('change', fotoSeleccionada);

    /**
     * @ngdoc method
     * @name success
     * @methodOf copernicus.controller:registroController
     * @description
     * Método llamado si el registro se completó con éxito. Crea una cookie en el navegador con el token de sesión y
     * redirige al usuario a la página principal de la aplicación.
     *
     * @param {object} res Respuesta de la API REST.
     *
     **/
    function success(res) {
        $scope.messages.showError = false;
        $cookies.put('token', res.data.token);
        $window.location.href = '/mainPage';
    }

    /**
     * @ngdoc method
     * @name error
     * @methodOf copernicus.controller:registroController
     * @description
     * Método llamado si el registro no se pudo completar. Muestra un mensaje uno u otro mensaje de error dependiendo
     * si el problema fue del servidor o del usuario.
     *
     * @param {object} err Respuesta de la API REST.
     *
     **/
    function error(err) {
        if (!utils.checkDatabaseError(err)) {
            utils.mensajeError($translate.instant("DATOS_INTRODUCIDOS_INCORRECTOS_CORREO"));
            $scope.messages.showError = true;
        }
    }

    /**
     * @ngdoc method
     * @name comprobarCaracter
     * @methodOf copernicus.controller:registroController
     * @description
     * Método utilizado para que el usuario no pueda introducir espacios en blanco en el nombre de usuario.
     *
     * @param {object} event Evento del cual se puede tener el código de la tecla introducida por el usuario.
     *
     **/
    $scope.comprobarCaracter = function (event) {
        if (event.which == 32) {
            event.preventDefault();
        }
    };

});