var copernicus = angular.module('copernicus');

copernicus.controller('ajustesCuentaController', function ($scope, $http, $window, utils, growl, $translate, $cookies) {

    $scope.usuario;
    $scope.pass;
    $scope.foto;
    $scope.fotoRecortada = '';
    var fotoCambiada = false;
    var sizeMaxFoto = 8000000; //8MB
    var actualizando_mensaje;

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

    $scope.eliminarCuenta = function () {
        $http({
            method: "POST",
            url: "api/eliminarCuenta"
        }).then(cuentaEliminada, mensajeError);
    }

    /**
     * Elimina la cookie 'token' del usuario y refresca la página. De esta forma será devuelto a la página de
     * inicio de sesión y registro
     *
     * @param res
     */
    var cuentaEliminada = function (res) {
        $cookies.remove('token');
        $window.location.reload();
    }

    /**
     * Muestra un mensaje para indicar que los datos fueron actualizados correctamente
     *
     * @param res
     */
    var mensajeExitoDatos = function (res) {
        utils.mensajeSuccess($translate.instant('DATOS_ACTUALIZADOS_CORRECTAMENTE'));
        $window.location.reload();
    };

    /**
     * Muestra un mensaje para indicar que la contraseña fue modificada
     *
     * @param res
     */
    var mensajeExitoPass = function (res) {
        utils.mensajeSuccess($translate.instant('PASS_MODIFICADA'));
    };

    /**
     * Muestra un error en el caso de que algún dato enviado fuese erróneo
     *
     * @param res
     */
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