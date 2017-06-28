var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:ajustesCuentaController
 *
 * @description
 * Controlador que permite al usuario modificar los datos y contraseña de su cuenta, así como eliminarla.
 */
copernicus.controller('ajustesCuentaController', function ($scope, $http, $window, utils, growl, $translate, $cookies) {

    /**
     * @ngdoc property
     * @name usuario
     * @propertyOf copernicus.controller:ajustesCuentaController
     * @description
     * Datos del usuario el cual está modificando su cuenta.
     *
     **/
    $scope.usuario;

    /**
     * @ngdoc property
     * @name pass
     * @propertyOf copernicus.controller:ajustesCuentaController
     * @description
     * En este objeto se almacena la contraseña actual y la nueva seleccionada por el usuario.
     *
     **/
    $scope.pass;

    /**
     * @ngdoc property
     * @name foto
     * @propertyOf copernicus.controller:ajustesCuentaController
     * @description
     * En este objeto se almacena la foto seleccionada por el usuario.
     *
     **/
    $scope.foto;

    /**
     * @ngdoc property
     * @name fotoRecortada
     * @propertyOf copernicus.controller:ajustesCuentaController
     * @description
     * Almacena la foto recortada subida por el usuario.
     *
     **/
    $scope.fotoRecortada = '';

    /**
     * @ngdoc property
     * @name fotoCambiada
     * @propertyOf copernicus.controller:ajustesCuentaController
     * @description
     * Booleano que indica si el usuario modifica su foto.
     *
     **/
    var fotoCambiada = false;

    /**
     * @ngdoc property
     * @name sizeMaxFoto
     * @propertyOf copernicus.controller:ajustesCuentaController
     * @description
     * Indica el tamaño máximo de fotografía aceptado.
     *
     **/
    var sizeMaxFoto = 8000000; //8MB

    /**
     * @ngdoc property
     * @name actualizando_mensaje
     * @propertyOf copernicus.controller:ajustesCuentaController
     * @description
     * Propiedad utilizada para resolver un problema a la hora de eliminar una notificación cuando se produce un error.
     *
     **/
    var actualizando_mensaje;

    /**
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:ajustesCuentaController
     * @description
     * Inicializa el controlador obteniendo los datos del usuario y almacenandolos en el atributo 'usuario'.
     *
     **/
    var inicializacion = function(){
        $http({
            method: "GET",
            url: "api/perfil"
        }).then(success);

        function success(res) {
            $scope.usuario = res.data[0];
        }
    }

    inicializacion();

    /**
     * @ngdoc method
     * @name fotoSeleccionada
     * @methodOf copernicus.controller:ajustesCuentaController
     * @description
     * Método invocado cuando un usuario selecciona una foto de perfil.
     *
     * @param {object} evt Contiene la fotografía seleccionada por el usuario.
     *
     **/
    var fotoSeleccionada = function (evt) {

        var size = document.getElementById('foto-input').files[0].size;

        if (size < sizeMaxFoto) {
            fotoCambiada = true;
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.foto = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        } else {
            utils.mensajeError($translate.instant("FOTO_SIZE_MAXIMO"));
        }
    };

    angular.element(document.querySelector('#foto-input')).on('change', fotoSeleccionada);


    /**
     * @ngdoc method
     * @name actualizarDatos
     * @methodOf copernicus.controller:ajustesCuentaController
     * @description
     * Actualiza los datos del usuario.
     *
     **/
    $scope.actualizarDatos = function () {
        actualizando_mensaje = growl.info($translate.instant('ACTUALIZANDO_DATOS'), {reference: 1});
        $http({
            method: "POST",
            url: "api/modificarDatos",
            data: {
                nombre: $scope.usuario.nombre,
                apellidos: $scope.usuario.apellidos,
                email: $scope.usuario.email,
                foto: $scope.fotoRecortada,
                fotoCambiada: fotoCambiada
            }
        }).then(mensajeExitoDatos, mensajeError);
    };

    /**
     * @ngdoc method
     * @name actualizarPassword
     * @methodOf copernicus.controller:ajustesCuentaController
     * @description
     * Actualiza la contraseña del usuario.
     *
     **/
    $scope.actualizarPassword = function () {
        $http({
            method: "POST",
            url: "api/modificarPass",
            data: {
                username: $scope.usuario.username,
                password: $scope.pass.old,
                passwordNueva: $scope.pass.new
            }
        }).then(mensajeExitoPass, mensajeError);
    };

    /**
     * @ngdoc method
     * @name eliminarCuenta
     * @methodOf copernicus.controller:ajustesCuentaController
     * @description
     * Elimina la cuenta de un usuario.
     *
     **/
    $scope.eliminarCuenta = function () {
        $http({
            method: "POST",
            url: "api/eliminarCuenta"
        }).then(cuentaEliminada, mensajeError);
    }

    /**
     *
     *
     * @param res
     */


    /**
     * @ngdoc method
     * @name cuentaEliminada
     * @methodOf copernicus.controller:ajustesCuentaController
     * @description
     * Elimina la cookie 'token' del usuario y refresca la página. De esta forma el usuario será devuelto a la página de
     * inicio de sesión y registro.
     *
     * @param {object} res Respuesta de la API REST
     *
     **/
    var cuentaEliminada = function (res) {
        $cookies.remove('token');
        $window.location.reload();
    }

    /**
     * @ngdoc method
     * @name mensajeExitoDatos
     * @methodOf copernicus.controller:ajustesCuentaController
     * @description
     * Muestra un mensaje para indicar que los datos fueron actualizados correctamente.
     *
     * @param {object} res Respuesta de la API REST
     *
     **/
    var mensajeExitoDatos = function (res) {
        utils.mensajeSuccess($translate.instant('DATOS_ACTUALIZADOS_CORRECTAMENTE'));
        $window.location.reload();
    };

    /**
     * @ngdoc method
     * @name mensajeExitoPass
     * @methodOf copernicus.controller:ajustesCuentaController
     * @description
     * Muestra un mensaje para indicar que la contraseña fue modificada.
     *
     * @param {object} res Respuesta de la API REST
     *
     **/
    var mensajeExitoPass = function (res) {
        utils.mensajeSuccess($translate.instant('PASS_MODIFICADA'));
    };

    /**
     * @ngdoc method
     * @name mensajeError
     * @methodOf copernicus.controller:ajustesCuentaController
     * @description
     * Muestra un error en el caso de que algún dato enviado fuese erróneo.
     *
     * @param {object} res Respuesta de la API REST
     *
     **/
    var mensajeError = function (res) {
        if (actualizando_mensaje)
            actualizando_mensaje.destroy();

        switch (res.data) {
            case 'nombre':
                utils.mensajeError($translate.instant('NOMBRE_ERRONEO'));
                break;

            case 'apellidos':
                utils.mensajeError($translate.instant('APELLIDOS_ERRONEO'));
                break;

            case 'email':
                utils.mensajeError($translate.instant('EMAIL_ERRONEO'));
                break;

            case 'pass':
                utils.mensajeError($translate.instant('PASS_ERRONEO'));
                break;

            case 'cuenta':
                utils.mensajeError($translate.instant('CUENTA_ERRONEO'));
                break;
        }
    };

});