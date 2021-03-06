/**
 * @ngdoc directive
 * @name copernicus.directive:passwordValidation
 *
 * @description
 * Directiva utilizada para validar que la contraseña y la contraseña de confirmación coinciden.
 */
angular.module("copernicus").directive("passwordValidation",[function () {
    return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var password1 = '#' + attrs.passwordValidation;
                $(elem).add(password1).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val()===$(password1).val();
                        ctrl.$setValidity('samepass', v);
                    });
                });
            }
        }
    }]);