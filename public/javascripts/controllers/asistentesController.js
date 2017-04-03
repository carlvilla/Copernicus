angular.module('webApp')
    .controller('asistentesController', function ($scope, webSocketManager) {
        $scope.asistentes = {nombre:"Roquete"};//webSocketManager.asistentesManager.getPeople();
    });