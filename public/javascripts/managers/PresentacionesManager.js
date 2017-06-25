/**
 * @ngdoc function
 * @name copernicus.function:PresentacionesManager
 * @description
 * Este manager se encarga de la gestión del servicio de presentaciones.
 */
function PresentacionesManager(ws, utils, $translate) {

    /**
     * @ngdoc property
     * @name usernameUsuario
     * @propertyOf copernicus.function:PresentacionesManager
     * @description
     * Nombre de usuario del usuario.
     *
     **/
    var usernameUsuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.function:PresentacionesManager
     * @description
     * ID de la sala.
     *
     **/
    var sala;

    /**
     * @ngdoc property
     * @name iframe
     * @propertyOf copernicus.function:PresentacionesManager
     * @description
     * Iframe utilizado para mostrar las presentaciones.
     *
     **/
    var iframe;

    /**
     * @ngdoc property
     * @name presentacion
     * @propertyOf copernicus.function:PresentacionesManager
     * @description
     * Presentación que se muestra.
     *
     **/
    var presentacion;

    /**
     * @ngdoc method
     * @name inicializar
     * @methodOf copernicus.function:PresentacionesManager
     * @description
     * Inicializa los valores de los atributoes 'iframe', 'usernameUsuario' y 'sala'. En el caso de que el atributo
     * 'presentacion' tuviese algún valor, eso significa que otro usuario pasó una presentación antes de abrir el
     * servicio por lo que se carga en el Iframe.
     *
     * @param {String} username Nombre de usuario del usuario.
     * @param {String} salaParam ID de la sala.
     *
     **/
    this.inicializar = function (username, salaParam) {
        usernameUsuario = username;
        iframe = document.getElementById('presentacion-frame');
        sala = salaParam;

        if (presentacion)
            iframe.src = presentacion;

    };

    /**
     * @ngdoc method
     * @name actualizarPresentacion
     * @methodOf copernicus.function:PresentacionesManager
     * @description
     * Actualiza la presentación que se muestra a partir de una enviada por otro usuario.
     *
     * @param {object} mensaje Mensaje con la presentación a mostrar.
     *
     **/
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

    /**
     * @ngdoc method
     * @name cambiarPresentacion
     * @methodOf copernicus.function:PresentacionesManager
     * @description
     * Cambia la presentación que se muestra y la envía a los usuarios conectados a la sala.
     *
     * @param {object} presentacionParam Mensaje con la presentación a mostrar.
     *
     **/
    this.cambiarPresentacion = function (presentacionParam) {

        var mensaje = {
            accion: 'cambiar',
            presentacion: presentacionParam
        };

        if (iframe)
            iframe.src = presentacionParam;

        sendData(mensaje);

    }

    /**
     * @ngdoc method
     * @name sendData
     * @methodOf copernicus.function:PresentacionesManager
     * @description
     * Envía una presentación a los usuarios conectados a la sala a través del servidor de WebSockets.
     *
     * @param {object} mensaje Mensaje con la presentación.
     *
     **/
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
