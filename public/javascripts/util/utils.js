var copernicus = angular.module('copernicus');

/**
 * @ngdoc service
 * @name copernicus.service:utils
 *
 * @description
 * Servicio que proporciona métodos de utilidad.
 */
copernicus.service('utils', function ($http, $window, growl, $translate) {

    /**
     * @ngdoc method
     * @name IsJsonString
     * @methodOf copernicus.service:utils
     * @description
     * Comprueba si un String es un JSON válido.
     *
     * @param {String} str String a comprobar.
     * @return {Boolean} Resultado de la comprobación.
     *
     **/
    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    /**
     * @ngdoc method
     * @name checkDatabaseError
     * @methodOf copernicus.service:utils
     * @description
     * Comprueba si la respuesta fue errónea por un error interno del servidor.
     *
     * @param {object} err Respuesta del servidor.
     * @return {Boolean} Resultado de la comprobación.
     *
     **/
    function checkDatabaseError (err){
       if(err.status == 500){
           mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
           return true;
       }
       return false;
    }

    /**
     * @ngdoc method
     * @name checkIdSalaExists
     * @methodOf copernicus.service:utils
     * @description
     * Comprobamos que se pase un idSala, en caso contrario el usuario habrá accedido directamente a la
     * página de salas sin haber seleccionado una sala.
     *
     * @param {String} id ID de la sala.
     *
     **/
    function checkIdSalaExists(idSala) {
        if (!idSala) {
            noAutorizado();
        }
    }

    /**
     * @ngdoc method
     * @name checkParticipante
     * @methodOf copernicus.service:utils
     * @description
     * Comprobar usuario es participante de la sala.
     *
     * @param {String} idSala ID de la sala.
     *
     **/
    function checkParticipante(idSala) {
        $http({
            method: "POST",
            url: "api/salas",
            data: angular.toJson({idSala: idSala})
        }).then(function (res) {
        }, noAutorizado);
    }

    /**
     * @ngdoc method
     * @name noAutorizado
     * @methodOf copernicus.service:utils
     * @description
     * Redirige al usuario a index, ya que intentó un acceso no autorizado.
     *
     **/
    var noAutorizado = function () {
        $window.location.href = '/';
    }

    //Mensajes Growl

    /**
     * @ngdoc method
     * @name mensajeSuccess
     * @methodOf copernicus.service:utils
     * @description
     * Muestra una notificación de éxito con tiempo.
     *
     * @param {String} mensaje Mensaje a mostrar en la notificación.
     *
     **/
    function mensajeSuccess(mensaje) {
        growl.success(mensaje, {ttl: 5000});
    };

    /**
     * @ngdoc method
     * @name mensajeInfo
     * @methodOf copernicus.service:utils
     * @description
     * Muestra una notificación de información con tiempo
     *
     * @param {String} mensaje Mensaje a mostrar en la notificación.
     *
     **/
    function mensajeInfo(mensaje) {
        growl.info(mensaje, {ttl: 5000});
    };

    /**
     * @ngdoc method
     * @name mensajeError
     * @methodOf copernicus.service:utils
     * @description
     * Muestra una notificación de error con tiempo
     *
     * @param {String} mensaje Mensaje a mostrar en la notificación.
     *
     **/
    function mensajeError(mensaje) {
        growl.error(mensaje, {ttl: 5000});
    };

    /**
     * @ngdoc method
     * @name mensajeSuccessSinTiempo
     * @methodOf copernicus.service:utils
     * @description
     * Muestra una notificación de éxito sin tiempo
     *
     * @param {String} mensaje Mensaje a mostrar en la notificación.
     *
     **/
    function mensajeSuccessSinTiempo(mensaje) {
        growl.success(mensaje);
    };

    /**
     * @ngdoc method
     * @name mensajeInfoSinTiempo
     * @methodOf copernicus.service:utils
     * @description
     * Muestra una notificación de información sin tiempo.
     *
     * @param {String} mensaje Mensaje a mostrar en la notificación.
     *
     **/
    function mensajeInfoSinTiempo(mensaje) {
        growl.info(mensaje);
    };

    /**
     * @ngdoc method
     * @name mensajeErrorSinTiempo
     * @methodOf copernicus.service:utils
     * @description
     * Muestra una notificación de error sin tiempo
     *
     * @param {String} mensaje Mensaje a mostrar en la notificación.
     *
     **/
    function mensajeErrorSinTiempo(mensaje) {
        growl.error(mensaje);
    };

    var methods = {
        IsJsonString: IsJsonString,
        checkIdSalaExists: checkIdSalaExists,
        checkParticipante: checkParticipante,
        checkDatabaseError: checkDatabaseError,
        mensajeSuccess: mensajeSuccess,
        mensajeInfo: mensajeInfo,
        mensajeError: mensajeError,
        mensajeSuccessSinTiempo: mensajeSuccessSinTiempo,
        mensajeInfoSinTiempo: mensajeInfoSinTiempo,
        mensajeErrorSinTiempo: mensajeErrorSinTiempo
    };
    return methods;

});