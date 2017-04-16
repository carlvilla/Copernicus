angular.module('webApp')
    .controller('videoconferenciaController', function ($scope, webSocketService) {

        console.log("videochat controller");
        $scope.data = {};

        $http({
            method: "GET",
            url: "api/profile"
        }).then(success, error);


        function success(res) {
            $scope.data.loading = webSocketService.videoconferenciaManager.isLoading();
//Send a message to the server with the user that is connected
            var usuario = res.data[0];

            webSocketService.videoconferenciaManager.setUser(usuario.username, usuario.nombre);

            webSocketService.videoconferenciaManager.init();

            $scope.disableVideoconferenceModel = webSocketManager.videoconferenciaManager.isDisabled();
            $scope.changeDisableVideoconferenceModel = function () {
                webSocketService.videoconferenciaManager.setDisabled($scope.disableVideoconferenceModel);
            };
            $scope.muteVideoconferenceModel = webSocketService.videoconferenciaManager.isMuted();
            $scope.changeMuteVideoconferenceModel = function () {
                webSocketService.videoconferenciaManager.setMuted($scope.muteVideoconferenceModel);
            };

        }
    });