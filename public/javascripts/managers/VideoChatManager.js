function VideoChatManager(ws) {

    //Solo podrán estar conectados 4 personas a la vez
    var videoLocal;
    var videoRemoto1;
    var videoRemoto2;
    var videoRemoto3;

    var usuario;
    var sala;

    var peerConnections = [];
    var remotes = [];

    var referenciaStream; //to save the reference of the stream

    var constraints = {
        audio: true,
        video: true
    };


    this.start = function (salaParam) {

        sala = salaParam;

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

        videoLocal.style.width = "100%";
        videoLocal.style.height = "100%";

        videoLocal.muted = true;

        console.log("Enviando mensaje 'login' desde videoChatManager")
        sendData('inicio');
    }


    this.getMessage = function (data) {

        console.log(data.operacion);

        switch (data.operacion) {
            case 'inicio':
                data.usuarios.forEach(function (user) {
                    console.log("Iniciar conferencia");
                    var localPeerConnection = iniciarVideoConferencia();

                    localPeerConnection.createOffer(
                        function gotLocalDescription(description) {
                            sendOffer(description, user);
                            localPeerConnection.setLocalDescription(description);
                        },

                        function onSignalingError(err) {
                            console.err('Failed to create signaling message: ' + err.message);
                        });

                    peerConnections.push({
                        'username': user,
                        'connection': localPeerConnection
                    });
                });

                break;

            case 'offer':
                onOffer(data.offer, data.usernameOrigen);
                break;

            case 'answer':
                onAnswer(data.answer, data.usernameObjetivo);
                break;

            case 'candidate':
                onCandidate(data.candidate, data.username);
                break;

            case 'cerrar':
                onCerrar(data.username);
                break;

            default:
                break;
        }
    }

    function iniciarVideoConferencia() {

        if (typeof RTCPeerConnection == "undefined")
            RTCPeerConnection = webkitRTCPeerConnection;

        var turnCredential = process.env.PASS_TURN;

        var configuration = {
            "iceServers": [
                {'url': 'stun:stun.l.google.com:19302'},
                {"url":"turn:carlvilla.swe@gmail.com@numb.viagenie.ca", "credential":turnCredential}]
        };
        var configuration;

        var localPeerConnection = new RTCPeerConnection(configuration);

        //Add the local stream (as returned by getUserMedia() to the local PeerConnection
        localPeerConnection.addStream(referenciaStream);

        //Add a handler associated with ICE protocol events
        //Handler to be called whenever a new local ICE candidate becomes available
        localPeerConnection.onicecandidate = function (event) {
            if (event.candidate) {
                console.log("Send candidate");
                sendCandidate(event.candidate, getUsername(localPeerConnection));
            }
        };

        //...and a second handler to be activated as soon as the remote stream becomes available
        //Handler to be called as soon as the remote stream becomes available
        localPeerConnection.onaddstream = function gotRemoteStream(event) {


            console.log("OnAddStream");

            //Aqui se tienen que utilizar los componentes remoteVideo1, remoteVideo2, remoteVideo3 (Puede haber como máximo 4 personas
            // haciendo una videoconferencia)


            if(videoRemoto1.src == ""){

                //Associate the remote video element with the retrieved stream
                videoRemoto1.src = window.URL.createObjectURL(event.stream);
                //videoRemote.className = 'videoRemote';

                console.log("VideoRemote: " + videoRemoto1);

                videoLocal.style.width = "50%";
                videoLocal.style.height = "100%";

                videoRemoto1.style.width = "50%";
                videoRemoto1.style.height = "100%";

                videoRemoto1.play();
                videoRemoto1.muted = false;

                remotes.push({
                    'username': getUsername(localPeerConnection),
                    'video': videoRemoto1
                });



            }
            else if(videoRemoto2.src == ""){

                //Associate the remote video element with the retrieved stream
                videoRemoto2.src = window.URL.createObjectURL(event.stream);
                //videoRemote.className = 'videoRemote';

                console.log("VideoRemote: " + videoRemoto1);


                videoLocal.style.width = "50%";
                videoLocal.style.height = "50%";

                videoRemoto1.style.width = "50%";
                videoRemoto1.style.height = "50%";

                videoRemoto2.style.width = "50%";
                videoRemoto2.style.height = "50%";


                videoRemoto2.play();
                videoRemoto2.muted = false;

                remotes.push({
                    'username': getUsername(localPeerConnection),
                    'video': videoRemoto2
                });


            } else if(videoRemoto3.src == ""){

                //Associate the remote video element with the retrieved stream
                videoRemoto3.src = window.URL.createObjectURL(event.stream);
                //videoRemote.className = 'videoRemote';

                console.log("VideoRemote: " + videoRemoto1);

                videoRemoto3.style.width = "50%";
                videoRemoto3.style.height = "50%";

                videoRemoto3.play();
                videoRemoto3.muted = false;


                remotes.push({
                    'username': getUsername(localPeerConnection),
                    'video': videoRemoto3
                });

            }else{
                //Si hay más de 4 participantes de momento si quita el video y solo se utiliza audio
                videoLocal.stop();
                videoRemoto1.stop();
                videoRemoto2.stop();
                videoRemoto3.stop();

            }

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
                return peerConnections[i].username;
            }
        }
    }


    this.setMuted = function (mute) {
        muted = mute;
        if (muted) { //mute myself
            theStream.getAudioTracks()[0].enabled = false;
        }
        else {
            theStream.getAudioTracks()[0].enabled = true;
        }
        remotes.forEach(function (remote) { //mute others
            remote.video.muted = mute;
        });
    };


    this.isMuted = function () {
        return muted;
    };


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


    function onOffer(offer, usernameOrigen) {
        console.log("Recibe offer de: " + usernameOrigen);
        var localPeerConnection = iniciarVideoConferencia();
        peerConnections.push({
            'username': usernameOrigen,
            'connection': localPeerConnection
        });
        localPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        localPeerConnection.createAnswer(function (answer) {
            localPeerConnection.setLocalDescription(answer);
            sendAnswer(answer, usernameOrigen);
        }, function (err) {
            console.error(err);
        });
    }

    function onAnswer(answer, targetUsername) {
        console.log("Recibe answer de: " + targetUsername);
        peerConnections.forEach(function (peer) {
            if (peer.username == targetUsername) {
                peer.connection.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });
    }

    function onCandidate(candidate, username) {
        peerConnections.forEach(function (peer) {
            if (peer.username == username) {
                peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });
    }

    function onCerrar(username) {
        for (var i = 0; i < peerConnections.length; i++) {
            if (peerConnections[i].username == username) {
                peerConnections[i].connection.close();
                peerConnections.splice(i, 1);
                i--;
            }
        }
        for (var i = 0; i < remotes.length; i++) {
            if (remotes[i].username == username) {
                // area.removeChild(remotes[i].video);
                remotes.splice(i, 1);
                i--;
            }
        }
    }

    function sendAnswer(answer, usernameOrigen) {
        ws.send(JSON.stringify({
            'seccion': 'videoChat',
            'data': {
                'operacion': 'answer',
                'usernameOrigen': usernameOrigen,
                'usernameObjetivo': usuario.username,
                'answer': answer,
                'sala': sala
            }
        }));
    }


    function sendOffer(descripcion, usernameObjetivo) {
        ws.send(JSON.stringify({
            'seccion': 'videoChat',
            'data': {
                'operacion': 'offer',
                'usernameOrigen': usuario.username,
                'usernameObjetivo': usernameObjetivo,
                'offer': descripcion,
                'sala': sala
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
                'candidate': candidate,
                'sala': sala
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
                    'sala': sala
                }

            }));
    }

}