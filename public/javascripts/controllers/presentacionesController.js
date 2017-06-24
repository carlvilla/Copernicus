var copernicus = angular.module('copernicus');

copernicus.controller('presentacionesController', function ($scope, $rootScope, webSocketService, utils, $translate) {

    var usuario;
    var sala;

    var inicializacion = function(){

        usuario = $rootScope.usuario;
        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));

        webSocketService.presentacionesManager.inicializar(usuario.username, sala.idSala, $scope);

    }

    inicializacion();

    $scope.enviarFichero = function (file, errFiles) {

        var fr = new FileReader();

        if (file)
            fr.readAsDataURL(file);
        else {
            if (errFiles[0] && errFiles[0].$error == 'maxSize')
                utils.mensajeError($translate.instant('PRESENTACION_SIZE_MAXIMO'));
            return;
        }

        fr.onloadend = function () {
            switch (file.type) {
                case "text/html":
                case "application/pdf":
                    webSocketService.presentacionesManager.cambiarPresentacion(fr.result);
                    break;

                default:
                    utils.mensajeError($translate.instant('FICHERO_NO_VALIDO'));
                    break;
            }
        }
    }
});