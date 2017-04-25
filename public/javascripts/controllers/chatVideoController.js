var webApp = angular.module('webApp');

webApp.controller('videoController', function ($scope) {

    var video = document.getElementById("videoChat");
    var video2 = document.getElementById("videoChat2");
    var video3 = document.getElementById("videoChat3");
    var video4 = document.getElementById("videoChat4");


    var constraints = window.constraints = {
        audio: false,
        video: true
    };

    function handleSuccess(stream) {
        var videoTracks = stream.getVideoTracks();

        stream.oninactive = function() {
            console.log('Stream inactive');
        };
        window.stream = stream;
        video.srcObject = stream;
        video2.srcObject = stream;
        video3.srcObject = stream;
        video4.srcObject = stream;
    }

    function handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
                constraints.video.width.exact + ' px is not supported by your device.');
        } else if (error.name === 'PermissionDeniedError') {
            errorMsg('Permissions have not been granted to use your camera and ' +
                'microphone, you need to allow the page access to your devices in ' +
                'order for the demo to work.');
        }
        errorMsg('getUserMedia error: ' + error.name, error);
    }

    function errorMsg(msg, error) {
        if (typeof error !== 'undefined') {
            console.error(error);
        }
    }

    navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);


});
