/**
 * Created by carlosvillablanco on 26/02/2017.
 */

angular.module("myApp").directive("usernameValidation", function($http, $q){

    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function (scope, elm, attr, model) {

            model.$asyncValidators.usernameAvailable = function (username) {

                var defer = $q.defer();
                $http.get("/api/validarUsername/" + username).then(success, error);

                function success(res) {
                    if (res.data.length == 0) {
                        console.log("Valido");
                        scope.messages.showError = false;
                        model.$setValidity('usernameAvailable', true);
                        defer.resolve();
                    } else {
                        console.log("Escogido");
                        scope.messages.showError = true;
                        model.$setValidity('usernameAvailable', false);
                        defer.reject("Este usuario ya está en uso");
                    }
                }


                function error(res){
                    console.log("Error");
                    model.$setValidity('usernameAvailable', false);
                    defer.reject("Ha ocurrido un error");
                }

                return defer.promise;
            }
        }
    };
});



