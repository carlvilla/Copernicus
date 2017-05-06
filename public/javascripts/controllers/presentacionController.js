var webApp = angular.module('webApp');

webApp.controller('presentacionController', function ($scope, $rootScope, webSocketService) {

    //Id de la sala a la que se accedió
    var sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada")).idSala;

    webSocketService.presentacionManager.start(sala);
    webSocketService.presentacionManager.setUsuario($rootScope.usuario.username);


    $scope.dzCallbacks = {
        'addedfile': function (file) {
            console.log(file);
            $scope.newFile = file;
        },
        'success': function (file, xhr) {
            console.log(file, xhr);
        }
    };


    $scope.dzOptions = {
        url : '/alt_upload_url',
        paramName : 'photo',
        maxFilesize : '10',
        acceptedFiles : 'image/jpeg, images/jpg, image/png',
        addRemoveLinks : true
};

    $scope.dzMethods = {};
    $scope.removeNewFile = function(){
        $scope.dzMethods.removeFile($scope.newFile);
    };

});