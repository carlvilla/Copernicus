/**
 * @ngdoc directive
 * @name copernicus.directive:ngConfirmClick
 *
 * @description
 * Directiva utilizada para mostrar la ventana emergente de confirmación por defecto del navegador.
 */
angular.module("copernicus").directive('ngConfirmClick', [function($translate){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick;
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }])