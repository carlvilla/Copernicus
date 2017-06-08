var webApp = angular.module('webApp');

webApp.controller('presentacionController', function ($scope, $rootScope, webSocketService, growl, $translate) {

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
                growl.error($translate.instant('PRESENTACION_SIZE_MAXIMO'), {ttl: 5000});
            return;
        }

        fr.onloadend = function () {
            switch (file.type) {
                case "text/html":
                case "application/pdf":
                    webSocketService.presentacionManager.cambiarPresentacion(fr.result);
                    break;

                default:
                    growl.error($translate.instant('FICHERO_NO_VALIDO'), {ttl: 5000});
                    break;
            }
        }
    }
});