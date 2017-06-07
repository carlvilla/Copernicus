var webApp = angular.module('webApp');

webApp.controller('ajustesCuentaController', function ($scope, $http, $window, growl, $translate, $cookies) {

    $scope.usuario;
    $scope.pass;

    $http({
        method: "GET",
        url: "api/profile"
    }).then(success);

    function success(res) {
        $scope.usuario = res.data[0];
    }

    $scope.foto;
    $scope.fotoRecortada = '';
    var fotoCambiada = false;
    var sizeMaxFoto = 8000000; //8MB

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
            growl.error($translate.instant("FOTO_SIZE_MAXIMO"), {ttl: 5000});
        }
    };

    angular.element(document.querySelector('#foto-input')).on('change', fotoSeleccionada);

    var actualizando_mensaje;

    $scope.actualizar = function () {
        actualizando_mensaje = growl.info($translate.instant('ACTUALIZANDO_DATOS'), {reference: 1});
        $http({
            method: "POST",
            url: "api/modificarDatos",
            data: {
                usuario: $scope.usuario,
                foto: $scope.fotoRecortada,
                fotoCambiada: fotoCambiada
            }
        }).then(mensajeExitoDatos, mensajeError);
    };

    $scope.actualizarPass = function () {
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

    var cuentaEliminada = function (res) {
        $cookies.remove('token');
        $window.location.reload();
    }

    var mensajeExitoDatos = function (res) {
        growl.success($translate.instant('DATOS_ACTUALIZADOS_CORRECTAMENTE'), {ttl: 5000});
        $window.location.reload();
    };

    var mensajeExitoPass = function (res) {
        growl.success($translate.instant('PASS_MODIFICADA'), {ttl: 5000});
    };

    var mensajeError = function (res) {
        if (actualizando_mensaje)
            actualizando_mensaje.destroy();

        switch (res.data) {
            case 'nombre':
                growl.error($translate.instant('NOMBRE_ERRONEO'), {ttl: 5000});
                break;

            case 'apellidos':
                growl.error($translate.instant('APELLIDOS_ERRONEO'), {ttl: 5000});
                break;

            case 'email':
                growl.error($translate.instant('EMAIL_ERRONEO'), {ttl: 5000});
                break;

            case 'pass':
                growl.error($translate.instant('PASS_ERRONEO'), {ttl: 5000});
                break;

            case 'cuenta':
                growl.error($translate.instant('CUENTA_ERRONEO'), {ttl: 5000});
                break;
        }
    };


});