function PresentacionManager(ws) {

    var scope;
    var reveal;
    var usernameUsuario;
    var sala;

    var presentacion;

    this.start = function (salaParam, scopeParam) {
        var iframe = document.getElementById('presentacion-frame');
        scope = scopeParam;
        sala = salaParam;

    };

    this.setUsuario = function (username) {
        usernameUsuario = username;
    }

    this.actualizarPresentacion = function (mensaje) {

        switch (mensaje.accion) {
            case 'mover':

                var mover = {
                    indexh: mensaje.indexh,
                    indexv: mensaje.indexv,
                };

                reveal.slide(mover);

                break;

            case 'cambiar':

                var ifr = document.getElementById('presentacion-frame');

                if (ifr)
                    ifr.src = mensaje.presentacion;
                else{
                    presentacion = mensaje.presentacion;
                }

                break;

        }
    }

    var actualizarAsistentes = function (info) {
        var mensaje = {
            indexh: info.indexh,
            indexv: info.indexv,
            accion: 'mover'
        };

        sendData(mensaje);
    };

    this.cambiarPresentacion = function (presentacionParam) {

        var mensaje = {
            accion: 'cambiar',
            presentacion: presentacionParam
        };

        var ifr = document.getElementById('presentacion-frame');

        if (ifr)
            ifr.src = presentacionParam;

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
