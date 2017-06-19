var copernicus = angular.module('copernicus');

copernicus.service('utils', function ($http, $window, growl, $translate) {

    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    function checkDatabaseError (err){
       if(err.status == 500){
           mensajeError($translate.instant("ERROR_INTENTAR_MAS_TARDE"));
           return true;
       }
       return false;
    }

    function checkIdSalaExists(str) {
        if (!str) {
            noAutorizado();
        }
    }

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

    function mensajeSuccess(mensaje) {
        growl.success(mensaje, {ttl: 5000});
    };

    function mensajeInfo(mensaje) {
        growl.info(mensaje, {ttl: 5000});
    };

    function mensajeError(mensaje) {
        growl.error(mensaje, {ttl: 5000});
    };

    function mensajeSuccessSinTiempo(mensaje) {
        growl.success(mensaje);
    };

    function mensajeInfoSinTiempo(mensaje) {
        growl.info(mensaje);
    };

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