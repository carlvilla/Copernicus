function VideoconferenciaManager(ws) {


    var constraints = { //interested in video & audio
        audio: true,
        video: true
    };

    var videoLocal;

    var area;
    var loading = [true, true]; //server & video
    var muted = false; //by default, it is not muted
    var disabled = false; //by default, it is not disabled
    var user; //the local user
    var theStream; //to save the reference of the stream
    var peerConnections = []; //at the beginning, there are no connections
    var remotes = []; //remote multimedia stuff



    this.init = function(){

        var videoLocal = document.getElementsByTagName("video");
        console.log(videoLocal);
        var area = document.getElementById("videoconferenceArea");

        start();
        videoLocal.onloadeddata = function () {
            loading[1] = false;
            adjustSize();
        };


    }



    window.onresize = function () {
        adjustSize();
    };

    function adjustSize() {
        videoLocal.width = area.offsetWidth / 2.1;
        videoLocal.height = area.offsetWidth / 2.1;
        remotes.forEach(function (remote) {
            remote.video.width = area.offsetWidth / 2.1;
            remote.video.height = area.offsetWidth / 2.1;
        });
    }

    function start() {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(successCallback)
            .catch(errorCallback);
    }

    function successCallback(stream) {
        theStream = stream;
        //converting a MediaStream to a blob URL
        videoLocal.src = window.URL.createObjectURL(stream);
        console.log(videoLocal);
        videoLocal.play();
        videoLocal.muted = true;
        sendData('login');
    }

    function errorCallback(err) {
        // videoLocal.setAttribute('poster', 'images/videoconference.png');
        console.log(err);
    }

    this.setUser = function (username, nombre) {
        user = {
            username: username,
            name: nombre
        };
    };
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
    this.setDisabled = function (disable) {
        disabled = disable;
        if (disabled) {
            if (theStream != null) {
                videoLocal.pause();
                theStream.getTracks().forEach(function (track) {
                    track.stop();
                });
                this.setDisconnected();
                growl.info('The videoconference has been disabled', {
                    title: 'Info'
                });
            }
        }
        else {
            start();
            growl.info('The videoconference has been enabled', {
                title: 'Info'
            });
        }
    };

    this.isDisabled = function () {
        return disabled;
    };

    this.setLoading = function (progress) {
        loading[0] = progress;
    };

    this.isLoading = function () {
        return loading;
    };
    function startingCallCommunication() {
        if (typeof RTCPeerConnection == "undefined")
            RTCPeerConnection = webkitRTCPeerConnection;
//This is an optional configuration string, associated with NAT traversal
        var configuration = {
            "iceServers": [{"urls": "stun:stun.phoneserve.com"}]
        };
        var configuration;
        var localPeerConnection = new RTCPeerConnection(configuration);
        //Add the local stream (as returned by getUserMedia() to the local PeerConnection
        localPeerConnection.addStream(theStream);
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
            var videoRemote = document.createElement("VIDEO");
//Associate the remote video element with the retrieved stream
            videoRemote.src = window.URL.createObjectURL(event.stream);
            videoRemote.className = 'videoRemote';
            videoRemote.play();
            videoRemote.muted = false;
            remotes.push({
                'username': getUsername(localPeerConnection), //the other username
                'video': videoRemote
            });
            adjustSize();
            area.appendChild(videoRemote);
        };
        return localPeerConnection;
    }

    function getUsername(localPeerConnection) {
        for (var i = 0; i < peerConnections.length; i++) {
            if (peerConnections[i].connection == localPeerConnection) {
                return peerConnections[i].username;
            }
        }
    }

    this.getMessage = function (data) {
        switch (data.operation) {
            case 'login':
                data.others.forEach(function (user) {


//we're all set! Create an Offer to be 'sent' to the callee as soon as the  local SDP is ready
                    var localPeerConnection = startingCallCommunication();
                    //Handler to be called when the 'local' SDP becomes available
                    localPeerConnection.createOffer(
                        function gotLocalDescription(description) {
                            sendOffer(description, user);
                            localPeerConnection.setLocalDescription(description);
                        },
                        function onSignalingError(err) {
                            console.err('Failed to create signaling message: ' + err.message);
                        });
                    peerConnections.push({
                        'username': user, //the other user
                        'connection': localPeerConnection
                    });
                });
                break;
            case 'offer':
                onOffer(data.offer, data.sourceUsername);
                break;
            case 'answer':
                onAnswer(data.answer, data.targetUsername);
                break;
            case 'candidate':
                onCandidate(data.candidate, data.username);
                break;
            case 'leave':
                onLeave(data.username);
                break;
            default:
                break;
        }
    };
    function onOffer(offer, sourceUsername) {
        var localPeerConnection = startingCallCommunication();
        peerConnections.push({
            'username': sourceUsername, //the other user
            'connection': localPeerConnection
        });
        localPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        localPeerConnection.createAnswer(function (answer) {
            localPeerConnection.setLocalDescription(answer);
            sendAnswer(answer, sourceUsername);
        }, function (err) {
            console.error(err);
        });
    }

    function onAnswer(answer, targetUsername) {
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

    function onLeave(username) {
        for (var i = 0; i < peerConnections.length; i++) {
            if (peerConnections[i].username == username) {
                peerConnections[i].connection.close();
                peerConnections.splice(i, 1);
                i--;
            }
        }
        for (var i = 0; i < remotes.length; i++) {
            if (remotes[i].username == username) {
                area.removeChild(remotes[i].video);
                remotes.splice(i, 1);
                i--;
            }
        }
    }

    this.setDisconnected = function () {
        sendData('leave');
        for (var i = 0; i < peerConnections.length; i++) {
            peerConnections[i].connection.close();
            peerConnections.splice(i, 1);
            i--;
        }
        for (var i = 0; i < remotes.length; i++) {
            area.removeChild(remotes[i].video);
            remotes.splice(i, 1);
            i--;
        }
    };
    function sendData(operation) {
        ws.send(JSON.stringify({
            'section': 'videoconference', 'data': {
                'operation': operation,
                'username': user.username,
            }
        }));
    }

    function sendOffer(description, targetUsername) {
        ws.send(JSON.stringify({
            'section': 'videoconference', 'data': {
                'operation': 'offer',
                'sourceUsername': user.username, 'targetUsername': targetUsername, 'offer': description
            }
        }));
    }

    function sendAnswer(answer, sourceUsername) {
        ws.send(JSON.stringify({
            'section': 'videoconference', 'data': {
                'operation': 'answer',
                'sourceUsername': sourceUsername,
                'targetUsername': user.username,
                'answer': answer
            }
        }));
    }

    function sendCandidate(candidate, otherUsername) {
        ws.send(JSON.stringify({
            'section': 'videoconference',
            'data': {
                'operation': 'candidate', 'username': user.username, 'otherUsername': otherUsername,
                'candidate': candidate
            }
        }));
    }
}
