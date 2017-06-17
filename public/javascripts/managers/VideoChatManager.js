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

    //Al silenciar a los otros usuarios, se silencian los usuarios actualmente conectados. Por lo tanto es necesario
    //una variable que almacene el estado del sonido de los videos remotos por si se conecta un nuevo usuario.
    var sonidoSilenciado = false;

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

        navigator.mediaDevices.getUserMedia(constraints).then(successVideo).catch(errorVideo);
    }

    this.setUsuario = function (user) {
        usuario = user;
    }

    function successVideo(stream) {
        referenciaStream = stream;
        var videoTracks = stream.getVideoTracks();

        stream.oninactive = function () {
            console.log('Stream inactivo');
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

        var configuration = {
            "iceServers": [
                {'url': 'stun:stun.l.google.com:19302'}]
        };
        var configuration;

        var localPeerConnection = new RTCPeerConnection(configuration);
        localPeerConnection.addStream(referenciaStream);

        localPeerConnection.onicecandidate = function (event) {
            if (event.candidate) {
                console.log("Send candidate");
                sendCandidate(event.candidate, getUsername(localPeerConnection));
            }
        };

        localPeerConnection.onaddstream = function gotRemoteStream(event) {

            console.log("OnAddStream");

            //Aqui se tienen que utilizar los componentes remoteVideo1, remoteVideo2, remoteVideo3 (Puede haber como máximo 4 personas
            // haciendo una videoconferencia)

            var username = getUsername(localPeerConnection);

            if (!videoRemoto1.username) {

                console.log("Videoremoto1");

                //Associate the remote video element with the retrieved stream
                videoRemoto1.src = window.URL.createObjectURL(event.stream);
                //videoRemote.className = 'videoRemote';

                console.log("VideoRemote: " + videoRemoto1);

                videoLocal.style.width = "50%";
                videoLocal.style.height = "100%";

                videoRemoto1.style.width = "50%";
                videoRemoto1.style.height = "100%";

                videoRemoto1.username = (username);

                videoRemoto1.play();
                videoRemoto1.muted = sonidoSilenciado;

                remotes.push({
                    'username': username,
                    'video': videoRemoto1
                });

            }
            else if (!videoRemoto2.username) {

                console.log("Videoremoto2");

                videoRemoto2.src = window.URL.createObjectURL(event.stream);

                console.log("VideoRemote: " + videoRemoto1);

                videoLocal.style.width = "50%";
                videoLocal.style.height = "50%";

                videoRemoto1.style.width = "50%";
                videoRemoto1.style.height = "50%";

                videoRemoto2.style.width = "50%";
                videoRemoto2.style.height = "50%";
                videoRemoto2.style.marginLeft = "25%";
                videoRemoto2.style.marginRight = "25%";

                videoRemoto2.username = (username);

                videoRemoto2.play();
                videoRemoto2.muted = sonidoSilenciado;

                remotes.push({
                    'username': getUsername(localPeerConnection),
                    'video': videoRemoto2
                });

            } else if (!videoRemoto3.username) {

                console.log("Videoremoto3");

                //Associate the remote video element with the retrieved stream
                videoRemoto3.src = window.URL.createObjectURL(event.stream);
                //videoRemote.className = 'videoRemote';

                console.log("VideoRemote: " + videoRemoto1);

                videoRemoto2.style.marginLeft = "0";
                videoRemoto2.style.marginRight = "0";

                videoRemoto3.style.width = "50%";
                videoRemoto3.style.height = "50%";

                videoRemoto3.username = (username);

                videoRemoto3.play();
                videoRemoto3.muted = sonidoSilenciado;

                remotes.push({
                    'username': getUsername(localPeerConnection),
                    'video': videoRemoto3
                });

            } else {
                console.log("Más de 4");
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
        sonidoSilenciado = mute;
        remotes.forEach(function (remote) {
            remote.video.muted = mute;
        });
    };

    this.setMutedMicrophone = function (mute) {
        referenciaStream.getAudioTracks()[0].enabled = mute;
    };

    this.setVideo = function (video) {
        referenciaStream.getVideoTracks()[0].enabled = video;
    }

    function errorVideo(error) {
        console.log(error);
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
                actualizarVideos(username);
                remotes.splice(i, 1);
                i--;
            }
        }


    }

    /**
     * Pausa el video en el cual se muestra el usuario con el username pasado como parámetro, y se actualizan las
     * dimensiones de todos los videos
     *
     * @param username
     */
    function actualizarVideos(username) {
        switch (username) {
            case videoRemoto1.username:
                videoRemoto1.style.width = "0%";
                videoRemoto1.style.height = "0%";
                videoRemoto1.username = undefined;
                videoRemoto1.pause();
                break;

            case videoRemoto2.username:
                videoRemoto2.style.width = "0%";
                videoRemoto2.style.height = "0%";
                videoRemoto2.username = undefined;
                videoRemoto2.pause();
                break;

            case videoRemoto3.username:
                videoRemoto3.style.width = "0%";
                videoRemoto3.style.height = "0%";
                videoRemoto3.username = undefined;
                videoRemoto3.pause();
                break;

            default:
                console.log("Usuario mandado:" + username);
                console.log("VideoRemoto1: " + videoRemoto1.username);
                console.log("VideoRemoto2: " + videoRemoto2.username);
                console.log("VideoRemoto3: " + videoRemoto3.username);
                console.log("Error al restablecer los videos");
                break;
        }

        //Si no hay ningún video remoto, el video local ocupa el módulo
        if (!videoRemoto1.username && !videoRemoto2.username && !videoRemoto3.username) {
            videoLocal.style.width = "100%";
            videoLocal.style.height = "100%";

        } else {

            //Almacenamos en una variable los videos remotos disponibles
            var videosActualizar = [];

            if (videoRemoto1.username)
                videosActualizar.push(videoRemoto1);

            if (videoRemoto2.username)
                videosActualizar.push(videoRemoto2);

            if (videoRemoto3.username)
                videosActualizar.push(videoRemoto3);


            //Actualizamos las dimensiones del video local y de los videos remotos
            if (videosActualizar.length == 1) {
                videoLocal.style.width = "50%";
                videoLocal.style.height = "100%";

                videosActualizar[0].style.width = "50%";
                videosActualizar[0].style.height = "100%";
                videosActualizar[0].style.marginLeft = "0";
                videosActualizar[0].style.marginRight = "0";

            }
            else if (videosActualizar.length == 2) {
                videoLocal.style.width = "50%";
                videoLocal.style.height = "50%";

                videosActualizar[0].style.width = "50%";
                videosActualizar[0].style.height = "50%";

                videosActualizar[1].style.width = "50%";
                videosActualizar[1].style.height = "50%";
                videosActualizar[1].style.marginLeft = "25%";
                videosActualizar[1].style.marginRight = "25%";
            }
            else if (videosActualizar.length == 3) {
                videoLocal.style.width = "50%";
                videoLocal.style.height = "50%";

                videosActualizar[0].style.width = "50%";
                videosActualizar[0].style.height = "50%";

                videosActualizar[1].style.width = "50%";
                videosActualizar[1].style.height = "50%";
                videosActualizar[1].style.marginLeft = "0";
                videosActualizar[1].style.marginRight = "0";

                videosActualizar[2].style.width = "50%";
                videosActualizar[2].style.height = "50%";

            } else {
                //A partir de 4 personas utilizando el chat de video,
                //se pasa a una conversación solo por voz
                videoLocal.style.width = "0%";
                videoLocal.style.height = "0%";
                videoRemoto1.pause();

                videosActualizar[0].style.width = "0%";
                videosActualizar[0].style.height = "0%";
                videosActualizar[0].pause();

                videosActualizar[1].style.width = "0%";
                videosActualizar[1].style.height = "0%";
                videosActualizar[1].pause();

                videosActualizar[2].style.width = "0%";
                videosActualizar[2].style.height = "0%";
                videosActualizar[2].pause();
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

    this.setDisconnected = function () {
        sendData('cerrar');

        //Se vuelve a dejar la variable a false por si se abre la videollamada de nuevo
        sonidoSilenciado = false;


        for (var i = 0; i < peerConnections.length; i++) {
            peerConnections[i].connection.close();
            peerConnections.splice(i, 1);
            i--;
        }
        for (var i = 0; i < remotes.length; i++) {
            actualizarVideos(remotes[i].username);
            remotes.splice(i, 1);
            i--;
        }

        videoLocal.pause();

        if (referenciaStream)
            referenciaStream.getTracks().forEach(function (track) {
                track.stop();
            });

    };

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