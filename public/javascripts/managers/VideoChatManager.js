function VideoChatManager(ws) {

    //Solo podrán estar conectados 4 personas a la vez
    var videoLocal;
    var videoRemoto1;
    var videoRemoto2;
    var videoRemoto3;

    var usuario;

    var peerConnections = [];
    var remotes = [];

    var referenciaStream; //to save the reference of the stream

    var constraints = {
        audio: false,
        video: true
    };


    this.start = function () {

        videoLocal = document.getElementById("localVideo");
        videoRemoto1 = document.getElementById("remoteVideo1");
        videoRemoto2 = document.getElementById("remoteVideo2");
        videoRemoto3 = document.getElementById("remoteVideo3");

        navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
    }

    this.setUsuario = function (user) {
        usuario = user;
    }


    function handleSuccess(stream) {
        referenciaStream = stream;
        var videoTracks = stream.getVideoTracks();

        stream.oninactive = function () {
            console.log('Stream inactive');
        };
        window.stream = stream;
        videoLocal.srcObject = stream;

        console.log("Enviando mensaje 'login' desde videoChatManager")
        sendData('inicio');
    }


    this.getMessage = function (data) {
        switch (data.operacion) {

            case 'inicio':

                console.log(data);

                var localPeerConnection = iniciarVideoConferencia();

                localPeerConnection.createOffer(
                    function gotLocalDescription(description) {
                        sendOffer(description, usuario);
                        localPeerConnection.setLocalDescription(description);
                    },

                    function onSignalingError(err) {
                        console.err('Failed to create signaling message: ' + err.message);
                    });

                peerConnections.push({
                    'username': usuario,
                    'connection': localPeerConnection
                });


                break;


            default:

                break;


        }

    }

    function iniciarVideoConferencia() {

        if (typeof RTCPeerConnection == "undefined")
            RTCPeerConnection = webkitRTCPeerConnection;

        var configuration = {
            "iceServers": [{"urls": "stun:stun.phoneserve.com"}]
        };
        var configuration;

        var localPeerConnection = new RTCPeerConnection(configuration);

        //Add the local stream (as returned by getUserMedia() to the local PeerConnection
        localPeerConnection.addStream(referenciaStream);

        //Add a handler associated with ICE protocol events
        //Handler to be called whenever a new local ICE candidate becomes available
        localPeerConnection.onicecandidate = function (event) {
            if (event.candidate) {
                sendCandidate(event.candidate, getUsername(localPeerConnection));
            }
        };

        //...and a second handler to be activated as soon as the remote stream becomes available
        //Handler to be called as soon as the remote stream becomes available
        localPeerConnection.onaddstream = function gotRemoteStream(event) {


            //Aqui se tienen que utilizar los componentes remoteVideo1, remoteVideo2, remoteVideo3 (Puede haber como máximo 4 personas
            // haciendo una videoconferencia)
            var videoRemote = document.createElement("remoteVideo1");
            //Associate the remote video element with the retrieved stream
            videoRemote.src = window.URL.createObjectURL(event.stream);
            videoRemote.className = 'videoRemote';
            videoRemote.play();
            videoRemote.muted = false;

            remotes.push({
                'username': getUsername(localPeerConnection), //the other userName
                'video': videoRemote
            });
        };
        return localPeerConnection;

    }


    /**
     * Devuelve el nombre de usuario de la colección de peerConnection cuyo localPeerConnection
     * coincide con el pasado como parámetro
     *
     * @param localPeerConnection
     * @returns {*}
     */
    function getUsername(localPeerConnection) {
        for (var i = 0; i < peerConnections.length; i++) {
            if (peerConnections[i].connection == localPeerConnection) {
                return peerConnections[i].userName;
            }
        }
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

    function sendOffer(descripcion, usernameDestino) {
        ws.send(JSON.stringify({
            'seccion': 'videoChat',
            'data': {
                'operacion': 'offer',
                'usernameOrigen': usuario.username,
                'usernameDestino': usernameDestino,
                'offer': descripcion
            }
        }));
    }

    function sendCandidate(candidate, otherUsername) {
        ws.send(JSON.stringify({
            'seccion': 'videoChat',
            'data': {
                'operacion': 'candidate',
                'username': usuario.username,
                'otherUsername': otherUsername,
                'candidate': candidate
            }
        }));
    }

    function sendData(operacion) {
        ws.send(JSON.stringify(
            {
                'seccion': 'videoChat',
                'data': {
                    'operacion': operacion,
                    'username': usuario.username,
                }
            }));
    }

}