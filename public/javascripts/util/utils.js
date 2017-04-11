var webApp = angular.module('webApp');

webApp.service('utils', function () {

    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };
    var methods = {
        IsJsonString : IsJsonString
    };
    return methods;
});