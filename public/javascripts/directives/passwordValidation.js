angular.module("webApp").directive("passwordValidation",[function () {
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