function PresentacionManager(ws) {

    var scope;
    var reveal;
    var usernameUsuario;
    var sala;

    var iframe;
    var presentacion;

    this.start = function (salaParam, scopeParam) {
        iframe = document.getElementById('presentacion-frame');

        iframe.onload = function () {
            Reveal.addEventListener('slidechanged', actualizarAsistentes);
        }

        scope = scopeParam;
        sala = salaParam;

        if (presentacion)
            iframe.src = presentacion;

    };

    var actualizarAsistentes = function (evento) {
        console.log("Hola");
    }

    this.setUsuario = function (username) {
        usernameUsuario = username;
    }

    this.actualizarPresentacion = function (mensaje) {

        switch (mensaje.accion) {
            case 'cambiar':

                if (iframe)
                    iframe.src = mensaje.presentacion;
                else {
                    presentacion = mensaje.presentacion;
                }

                break;
        }
    }

    this.cambiarPresentacion = function (presentacionParam) {

        var mensaje = {
            accion: 'cambiar',
            presentacion: presentacionParam
        };


        if (iframe)
            iframe.src = presentacionParam;

        sendData(mensaje);

    }

    function sendData(mensaje) {
        ws.send(JSON.stringify(
            {
                'seccion': 'presentacion',
                'data': {
                    'indexh': mensaje.indexh,
                    'indexv': mensaje.indexv,
                    'accion': mensaje.accion,
                    'presentacion': mensaje.presentacion,
                    'username': usernameUsuario,
                    'sala': sala
                }

            }));
    }


}
