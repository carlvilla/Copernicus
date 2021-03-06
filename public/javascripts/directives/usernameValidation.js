/**
 * @ngdoc directive
 * @name copernicus.directive:usernameValidation
 *
 * @description
 * Directiva que comprueba si la contraseña introducida ya está en uso.
 */
angular.module("copernicus").directive("usernameValidation", function ($http, $q, utils) {
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function (scope, elm, attr, model) {

            model.$asyncValidators.usernameAvailable = function (username) {

                var defer = $q.defer();
                $http.get("/api/validarUsername/" + username).then(success, error);

                function success(res) {
                    //El nombre de usuario no puede contener espacios
                    if (res.data.length == 0) {
                        if (!(username.indexOf(' ') >= 0)) {
                            scope.messages.showError = false;
                            model.$setValidity('usernameAvailable', true);
                            model.$setValidity('usernameNoSpaces', true);
                            defer.resolve();
                        } else {
                            scope.messages.showError = true;
                            model.$setValidity('usernameAvailable', true);
                            model.$setValidity('usernameNoSpaces', false);
                        }
                    } else {
                        scope.messages.showError = true;
                        model.$setValidity('usernameAvailable', false);
                    }
                }
                function error(res) {
                    if (!utils.checkDatabaseError(res)) {
                        model.$setValidity('usernameAvailable', false);
                        defer.reject("Ha ocurrido un error");
                    }
                }
                return defer.promise;
            }
        }
    };
});



