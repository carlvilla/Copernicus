function ChatTextoManager(ws) {

    var mensajes = [];
    var usernameUsuario;
    var sala;


    this.setUsuario = function (username) {
        usernameUsuario = username;
    }

    this.setSala = function (salaParam) {
        sala = salaParam;
    }

    this.getMensajes = function () {
        return mensajes;
    }

    this.sendMensaje = function (mensaje) {
        sendData(mensaje);
        this.addMensaje({username: usernameUsuario, mensaje: mensaje, tipo: "texto"});
    }

    this.addMensaje = function (mensaje) {
        console.log("Recibido mensaje");
        var mensajeAux = {
            username: mensaje.username,
            mensaje: mensaje.mensaje,
            tipo: mensaje.tipo,
            fichero: mensaje.fichero,
            contenido: mensaje.contenido
        }
        mensajes.push(mensajeAux);
    }


    function sendData(mensaje) {
        ws.send(JSON.stringify(
            {
                'seccion': 'chatTexto',
                'data': {
                    'username': usernameUsuario,
                    'sala': sala,
                    'tipo': 'texto',
                    'mensaje': mensaje
                }

            }));
    }

    this.sendArchivo = function (file, tipo) {
        console.log("Enviar archivo");
        var fr = new FileReader();
        fr.readAsDataURL(file);

        fr.onloadend = function () {

            console.log("Nombre: " + file.name);

            ws.send(JSON.stringify({
                'seccion': 'chatTexto',
                'data': {
                    'tipo': tipo,
                    'fichero': file.name,
                    'contenido': fr.result,
                    'username': usernameUsuario,
                    'sala': sala
                }
            }));

            var mensaje = {
                tipo: tipo,
                fichero: file.name,
                contenido: fr.result,
                username: usernameUsuario
            }

            mensajes.push(mensaje);

        };
    }

}