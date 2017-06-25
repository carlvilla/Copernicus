var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:PresentacionesController
 *
 * @description
 * Este controlador es utilizado para comunicar al usuario con 'PresentacionesManager', de modo que pueda cambiar la
 * presentación y recibir las presentaciones de otros usuarios.
 */

copernicus.controller('presentacionesController', function ($scope, $rootScope, webSocketService, utils, $translate) {

    /**
     * @ngdoc property
     * @name usuario
     * @propertyOf copernicus.controller:PresentacionesController
     * @description
     * Almacena los datos del usuario.
     *
     **/
    var usuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.controller:PresentacionesController
     * @description
     * Almacena los datos de la sala accedida.
     *
     **/
    var sala;

    /**
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:PresentacionesController
     * @description
     * Inicializa el controlador, obteniendo los datos de la sala y del usuario e inicializa 'PresentacionesManager'
     * enviándole el nombre de usuario del usuario y el id de la sala.
     *
     **/
    var inicializacion = function () {

        usuario = $rootScope.usuario;
        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));

        webSocketService.presentacionesManager.inicializar(usuario.username, sala.idSala);

    }

    inicializacion();

    /**
     * @ngdoc method
     * @name enviarFichero
     * @methodOf copernicus.controller:PresentacionesController
     * @description
     * Envía la presentación seleccionada a 'PresentacionesManager'.
     *
     * @param {object} file Contiene la presentación seleccionada por el usuario
     * @param {object} errFiles Indica que al obtener el fichero seleccionado por el usuario.
     *
     **/
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