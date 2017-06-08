var webApp = angular.module('webApp');

webApp.service('utils', function ($http, $window) {

    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

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


    var methods = {
        IsJsonString: IsJsonString,
        checkIdSalaExists: checkIdSalaExists,
        checkParticipante: checkParticipante
    };
    return methods;

});