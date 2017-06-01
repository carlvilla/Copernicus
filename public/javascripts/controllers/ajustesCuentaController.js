var webApp = angular.module('webApp');

webApp.controller('ajustesCuentaController', function ($scope, $http, $window) {

    $http({
        method: "GET",
        url: "api/profile"
    }).then(success);

    function success(res) {
        $scope.usuario = res.data[0];
    }

    $scope.foto;
    $scope.fotoRecortada = '';
    var fotoCambiada = false;

    var fotoSeleccionada = function (evt) {
        fotoCambiada = true;
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.foto = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };

    angular.element(document.querySelector('#foto-input')).on('change', fotoSeleccionada);

});