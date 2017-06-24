function PresentacionesManager(ws, utils, $translate) {

    var usernameUsuario;
    var sala;
    var iframe;
    var presentacion;
    var scope;

    this.inicializar = function (username, salaParam, scopeParam) {
        usernameUsuario = username;
        iframe = document.getElementById('presentacion-frame');
        scope = scopeParam;
        sala = salaParam;

        if (presentacion)
            iframe.src = presentacion;

    };

    this.actualizarPresentacion = function (mensaje) {

        switch (mensaje.accion) {
            case 'cambiar':

                utils.mensajeInfo($translate.instant('PRESENTACION_CAMBIADA')+mensaje.username);

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
                    'accion': mensaje.accion,
                    'presentacion': mensaje.presentacion,
                    'username': usernameUsuario,
                    'sala': sala
                }

            }));
    }


}
