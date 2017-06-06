var webApp = angular.module('webApp');

webApp.controller('presentacionController', function ($scope, $rootScope, webSocketService, growl, $translate) {

    //Id de la sala a la que se accedió
    var sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada")).idSala;

    webSocketService.presentacionManager.start(sala);
    webSocketService.presentacionManager.setUsuario($rootScope.usuario.username);

    $scope.uploadFiles = function (file, errFiles) {

        var fr = new FileReader();

        if (file)
            fr.readAsDataURL(file);
        else {
            console.log(errFiles);
            if (errFiles[0] && errFiles[0].$error == 'maxSize')
                growl.error($translate.instant('PRESENTACION_SIZE_MAXIMO'), {ttl: 5000});
        }

        fr.onloadend = function () {

            var tipoFichero;

            $scope.presentacion = fr.result;

            document.getElementById('presentacion-frame').contentWindow.location.reload(true);
/*
            if (file) {
                switch (file.type) {
                    case "text/html":
                        $scope.presentacion = fr.result;

                        document.getElementById('presentacion-frame').contentWindow.location.reload(true);

                        break;

                    default:
                        growl.error($translate.instant('FICHERO_NO_VALIDO'), {ttl: 5000});
                        break;
                }
            }*/
        };
    }
});