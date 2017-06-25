/**
 * @ngdoc function
 * @name copernicus.function:VideollamadasManager
 * @description
 * Este manager se encarga de la gestión del servicio de videollamadas.
 */
function VideollamadasManager(ws) {

    /**
     * @ngdoc property
     * @name usernameUsuario
     * @propertyOf copernicus.function:VideollamadasManager
     * @description
     * Nombre de usuario del usuario.
     *
     **/
    var usernameUsuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.function:VideollamadasManager
     * @description
     * ID de la sala.
     *
     **/
    var sala;

    //Solo podrán estar conectados 4 personas con el video a la vez
    /**
     * @ngdoc property
     * @name videoLocal
     * @propertyOf copernicus.function:VideollamadasManager
     * @description
     * Referencia al video local.
     *
     **/
    var videoLocal;

    /**
     * @ngdoc property
     * @name videoRemoto1
     * @propertyOf copernicus.function:VideollamadasManager
     * @description
     * Referencia a un video remoto.
     *
     **/
    var videoRemoto1;

    /**
     * @ngdoc property
     * @name videoRemoto2
     * @propertyOf copernicus.function:VideollamadasManager
     * @description
     * Referencia a un video remoto.
     *
     **/
    var videoRemoto2;

    /**
     * @ngdoc property
     * @name videoRemoto3
     * @propertyOf copernicus.function:VideollamadasManager
     * @description
     * Referencia a un video remoto.
     *
     **/
    var videoRemoto3;

    /**
     * @ngdoc property
     * @name peerConnections
     * @propertyOf copernicus.function:VideollamadasManager
     * @description
     * Conexiones entre la máquina local y máquinas remotas.
     *
     **/
    var peerConnections = [];

    /**
     * @ngdoc property
     * @name remotes
     * @propertyOf copernicus.function:VideollamadasManager
     * @description
     * Relaciona los videos con el nombre de usuario del usuario.
     *
     **/
    var remotes = [];

    /**
     * @ngdoc property
     * @name referenciaStream
     * @propertyOf copernicus.function:VideollamadasManager
     * @description
     * Referencia al stream local.
     *
     **/
    var referenciaStream;

    //

    /**
     * @ngdoc property
     * @name sonidoSilenciado
     * @propertyOf copernicus.function:VideollamadasManager
     * @description
     * Al silenciar a los otros usuarios, se silencian los usuarios actualmente conectados. Por lo tanto, es necesario
     * esta variable que almacene el estado del sonido de los videos remotos por si se conecta un nuevo usuario.
     *
     **/
    var sonidoSilenciado = false;

    /**
     * @ngdoc property
     * @name constraints
     * @propertyOf copernicus.function:VideollamadasManager
     * @description
     * Objeto en el que se indica si se utilizará el video y audio en la videollamada.
     *
     **/
    var constraints = {
        audio: true,
        video: true
    };

    /**
     * @ngdoc method
     * @name inicializar
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Inicializa los valores de los atributoes 'usernameUsuario' y 'sala', establece referencias a los cuatro
     * reproductores de video e inicializa el video local.
     *
     * @param {String} username Nombre de usuario del usuario.
     * @param {String} salaParam ID de la sala.
     *
     **/
    this.inicializar = function (username, salaParam) {

        sala = salaParam;
        usernameUsuario = username;

        videoLocal = document.getElementById("localVideo");
        videoRemoto1 = document.getElementById("remoteVideo1");
        videoRemoto2 = document.getElementById("remoteVideo2");
        videoRemoto3 = document.getElementById("remoteVideo3");

        navigator.mediaDevices.getUserMedia(constraints).then(successVideo).catch(errorVideo);
    }

    /**
     * @ngdoc method
     * @name successVideo
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Realiza las preparaciones necesarias para mostrar el video local, y envía un mensaje de 'inicio' al resto de
     * usuarios a través de 'sendData'.
     *
     * @param {object} stream Stream del video local.
     *
     **/
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

        sendData('inicio');
    }

    /**
     * @ngdoc method
     * @name getMessage
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Recibe mensajes de otros usuarios para realizar ciertas acciones.
     *
     * @param {object} data Stream del video local.
     *
     **/
    this.getMessage = function (data) {

        console.log(data.operacion);

        switch (data.operacion) {
            case 'inicio':
                data.usuarios.forEach(function (user) {
                    console.log("Iniciar conferencia");
                    var localPeerConnection = iniciarVideollamada();

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

            case 'desconectado':
                onDesconectado(data.username);
                break;

            default:
                break;
        }
    }

    /**
     * @ngdoc method
     * @name iniciarVideollamada
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Inicia la videollamada.
     *
     **/
    function iniciarVideollamada() {

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

            //Aqui se tienen que utilizar los componentes remoteVideo1, remoteVideo2,
            // remoteVideo3 (Puede haber como máximo 4 personas
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
                    'username': username,
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
                    'username': username,
                    'video': videoRemoto3
                });

            }
        };
        return localPeerConnection;
    }

    /**
     * @ngdoc method
     * @name iniciarVideollamada
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Devuelve el nombre de usuario de la colección de peerConnection cuyo localPeerConnection
     * coincide con el pasado como parámetro.
     *
     * @param  {object} localPeerConnection Objeto localPeerConnection
     * @return {String} Nombre de usuario de la colección de peerConnection cuyo localPeerConnection
     * coincide con el pasado como parámetro
     *
     **/
    function getUsername(localPeerConnection) {
        for (var i = 0; i < peerConnections.length; i++) {
            if (peerConnections[i].connection == localPeerConnection) {
                return peerConnections[i].username;
            }
        }
    }

    /**
     * Silencia o activa el altavoz
     *
     * @param mute
     */

    /**
     * @ngdoc method
     * @name setAltavoz
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Activa o desactiva el altavoz
     *
     * @param {boolean} mute Indicia si el altavoz se activa o desactiva.
     *
     **/
    this.setAltavoz = function (mute) {
        sonidoSilenciado = mute;
        remotes.forEach(function (remote) {
            remote.video.muted = mute;
        });
    };

    /**
     * @ngdoc method
     * @name setMicrofono
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Activa o desactiva el micrófono
     *
     * @param {boolean} mute Indicia si el micrófono se activa o desactiva.
     *
     **/
    this.setMicrofono = function (mute) {
        referenciaStream.getAudioTracks()[0].enabled = mute;
    };

    /**
     * @ngdoc method
     * @name setVideo
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Activa o desactiva el video
     *
     * @param {boolean} mute Indicia si el video se activa o desactiva.
     *
     **/
    this.setVideo = function (video) {
        referenciaStream.getVideoTracks()[0].enabled = video;
    }


    /**
     * @ngdoc method
     * @name errorVideo
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Método invocado si se produce un error al inicializar el video local. Se muestra un mensaje indicando que ocurrió
     * un error.
     *
     * @param {object} error Error ocurrido.
     *
     **/
    function errorVideo(error) {
        utils.mensajeError($translate.instant("ERROR_VIDEOLLAMADA"));
    }


    /**
     * @ngdoc method
     * @name onOffer
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Se recibe una oferta de un usuario
     *
     * @param {object} offer Oferta recibida.
     * @param {String} usernameOrigen Nombre de usuario del usuario que manda la oferta.
     *
     **/
    function onOffer(offer, usernameOrigen) {
        console.log("Recibe offer de: " + usernameOrigen);
        var localPeerConnection = iniciarVideollamada();
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

    /**
     * @ngdoc method
     * @name onAnswer
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Se recibe una respuesta de un usuario
     *
     * @param {object} offer Respuesta recibida.
     * @param {String} usernameOrigen Nombre de usuario del usuario que manda la respuesta.
     *
     **/
    function onAnswer(answer, targetUsername) {
        console.log("Recibe answer de: " + targetUsername);
        peerConnections.forEach(function (peer) {
            if (peer.username == targetUsername) {
                peer.connection.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });
    }

    /**
     * @ngdoc method
     * @name onCandidate
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Se recibe un candidato de conexión de un usuario
     *
     * @param {object} candidate Candidato recibido.
     * @param {boolean} username Nombre de usuario del usuario que manda el candidato de conexión.
     *
     **/
    function onCandidate(candidate, username) {
        peerConnections.forEach(function (peer) {
            if (peer.username == username) {
                peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });
    }

    /**
     * @ngdoc method
     * @name onDesconectado
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Se recibe que un usuario se desconectó de la videollamada.
     *
     * @param {String} username Nombre de usuario del usuario que se desconectó de la videollamada.
     *
     **/
    function onDesconectado(username) {
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
     * @ngdoc method
     * @name actualizarVideos
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Pausa el video en el cual se muestra el usuario con el username pasado como parámetro, y se actualizan las
     * dimensiones de todos los videos
     *
     * @param {String} username Nombre de usuario del usuario cuyo video hay que actualizar.
     *
     **/
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

                //Si true, significa que era más de 4 y alguien salió
                if(!videosActualizar[1].getVideoTracks()[0].enabled){
                    videosActualizar.forEach(function(video){
                        videosActualizar.getVideoTracks()[0].enabled = true;
                    })
                }

            }

        }
    }

    /**
     * @ngdoc method
     * @name sendAnswer
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Envia una respuesta a cierto usuario.
     *
     * @param {String} usernameOrigen Nombre de usuario al que se envía la respuesta.
     *
     **/
    function sendAnswer(answer, usernameOrigen) {
        ws.send(JSON.stringify({
            'seccion': 'videoChat',
            'data': {
                'operacion': 'answer',
                'usernameOrigen': usernameOrigen,
                'usernameObjetivo': usernameUsuario,
                'answer': answer,
                'sala': sala
            }
        }));
    }

    /**
     * @ngdoc method
     * @name sendOffer
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Envia una oferta a cierto usuario.
     *
     * @param {String} usernameOrigen Nombre de usuario al que se envía la oferta.
     *
     **/
    function sendOffer(descripcion, usernameObjetivo) {
        ws.send(JSON.stringify({
            'seccion': 'videoChat',
            'data': {
                'operacion': 'offer',
                'usernameOrigen': usernameUsuario,
                'usernameObjetivo': usernameObjetivo,
                'offer': descripcion,
                'sala': sala
            }
        }));
    }

    /**
     * @ngdoc method
     * @name sendCandidate
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Envia un candidato de conexión a cierto usuario.
     *
     * @param {String} otherUsername Nombre de usuario al que se envía el candidato de conexión.
     *
     **/
    function sendCandidate(candidate, otherUsername) {
        ws.send(JSON.stringify({
            'seccion': 'videoChat',
            'data': {
                'operacion': 'candidate',
                'username': usernameUsuario,
                'otherUsername': otherUsername,
                'candidate': candidate,
                'sala': sala
            }
        }));
    }

    /**
     * @ngdoc method
     * @name setDesconectado
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Establece al usuario como desconectado.
     *
     **/
    this.setDesconectado = function () {
        sendData('desconectado');

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

    /**
     * @ngdoc method
     * @name setDesconectado
     * @methodOf copernicus.function:VideollamadasManager
     * @description
     * Envia mensajes con la operación realizada a los usuarios conectados a la videollamada a través del servidore
     * de WebSockets.
     *
     * @param {String} operacion Operación realizada.
     *
     **/
    function sendData(operacion) {
        ws.send(JSON.stringify(
            {
                'seccion': 'videoChat',
                'data': {
                    'operacion': operacion,
                    'username': usernameUsuario,
                    'sala': sala
                }

            }));
    }
}