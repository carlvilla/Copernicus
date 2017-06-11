var copernicus = angular.module('copernicus');

copernicus.controller('presentacionController', function ($scope, $rootScope, webSocketService, utils, $translate) {

    //Id de la sala a la que se accedió
    var sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada")).idSala;

    webSocketService.presentacionManager.start(sala, $scope);
    webSocketService.presentacionManager.setUsuario($rootScope.usuario.username);

    $scope.uploadFiles = function (file, errFiles) {

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
                    webSocketService.presentacionManager.cambiarPresentacion(fr.result);
                    break;

                default:
                    utils.mensajeError($translate.instant('FICHERO_NO_VALIDO'));
                    break;
            }
        }
    }
});