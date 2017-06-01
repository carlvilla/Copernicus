var webApp = angular.module('webApp');

webApp.controller('accesoSalaController', function ($scope, $http, $window) {

    $scope.selectedSala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));

});