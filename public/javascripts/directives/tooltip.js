/**
 * @ngdoc directive
 * @name copernicus.directive:tooltip
 *
 * @description
 * Directiva utilizada para mostrar tooltips de elementos generador con ng-repeat.
 */
angular.module('copernicus').directive('tooltip', [function () {
    return {
        restrict:'A',
        link: function(scope, element, attrs)
        {
            $(element)
                .attr('title',scope.$eval(attrs.tooltip))
                .tooltip({placement: "top"});
        }
    }
}]);