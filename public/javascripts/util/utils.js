var copernicus = angular.module('copernicus');

copernicus.service('utils', function ($http, $window, growl, $translate) {

    /**
     * Comprueba si un String es un JSON válido
     *
     * @param str
     * @returns {boolean}
     * @constructor
     */
    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    /**
     * Comprueba si la respuesta fue errónea por un error interno del servidor
     * @param err
     * @returns {boolean}
     */
    function checkDatabaseError (err){
       if(err.status == 500){
           mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
           return true;
       }
       return false;
    }

    /**
     * Comprobamos que existe el idSala, en caso contrario el usuario habrá accedido directamente a la
     * página de salas sin haber seleccionado una sala.
     * @param id
     */
    function checkIdSalaExists(id) {
        if (!id) {
            noAutorizado();
        }
    }

    /**
     * Comprobar usuario es participante de la sala
     * @param idSala
     */
    function checkParticipante(idSala) {
        $http({
            method: "POST",
            url: "api/salas",
            data: angular.toJson({idSala: idSala})
        }).then(function (res) {
        }, noAutorizado);
    }


    var noAutorizado = function () {
        $window.location.href = '/';
    }

    //Mensajes Growl

    /**
     * Muestra una notificación de éxito con tiempo
     *
     * @param mensaje
     */
    function mensajeSuccess(mensaje) {
        growl.success(mensaje, {ttl: 5000});
    };

    /**
     * Muestra una notificación de información con tiempo
     *
     * @param mensaje
     */
    function mensajeInfo(mensaje) {
        growl.info(mensaje, {ttl: 5000});
    };

    /**
     * Muestra una notificación de error con tiempo
     *
     * @param mensaje
     */
    function mensajeError(mensaje) {
        growl.error(mensaje, {ttl: 5000});
    };

    /**
     * Muestra una notificación de éxito sin tiempo
     *
     * @param mensaje
     */
    function mensajeSuccessSinTiempo(mensaje) {
        growl.success(mensaje);
    };

    /**
     * Muestra una notificación de información sin tiempo
     *
     * @param mensaje
     */
    function mensajeInfoSinTiempo(mensaje) {
        growl.info(mensaje);
    };


    /**
     * Muestra una notificación de error sin tiempo
     *
     * @param mensaje
     */
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