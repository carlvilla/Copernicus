/**
 * @ngdoc function
 * @name copernicus.function:ChatTextoManager
 * @description
 * Este manager se encarga de la gestión del chat de texto.
 */
function ChatTextoManager(ws, utils, $translate) {

    /**
     * @ngdoc property
     * @name usernameUsuario
     * @propertyOf copernicus.function:ChatTextoManager
     * @description
     * Nombre de usuario del usuario.
     *
     **/
    var usernameUsuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.function:ChatTextoManager
     * @description
     * ID de la sala.
     *
     **/
    var sala;

    /**
     * @ngdoc property
     * @name mensajes
     * @propertyOf copernicus.function:ChatTextoManager
     * @description
     * Mensajes enviados y recibidos.
     *
     **/
    var mensajes = [];

    /**
     * @ngdoc method
     * @name inicializar
     * @methodOf copernicus.function:ChatTextoManager
     * @description
     * Inicializa los valores de los atributos 'usernameUsuario' y 'sala'.
     *
     * @param {String} username Nombre de usuario del usuario.
     * @param {String} salaParam ID de la sala.
     *
     **/
    this.inicializar = function (username, salaParam){
        usernameUsuario = username;
        sala = salaParam;
    }

    /**
     * @ngdoc method
     * @name getMensajes
     * @methodOf copernicus.function:ChatTextoManager
     * @description
     * Devuelve todos los mensajes.
     *
     * @return {object[]} Listado de mensajes
     *
     **/
    this.getMensajes = function () {
        return mensajes;
    }

    /**
     * @ngdoc method
     * @name enviarMensaje
     * @methodOf copernicus.function:ChatTextoManager
     * @description
     * Envía un mensaje a través de 'sendData' al resto de usuarios conectados a la sala, y lo muestra en el chat
     * de texto.
     *
     * @param {String} mensaje Mensaje a enviar al resto de usuarios.
     *
     **/
    this.enviarMensaje = function (mensaje) {
        sendData(mensaje);
        this.addMensaje({username: usernameUsuario, mensaje: mensaje, tipo: "texto"});
    }

    /**
     * @ngdoc method
     * @name addMensaje
     * @methodOf copernicus.function:ChatTextoManager
     * @description
     * Guarda un mensaje recibido de modo que se mostrará en el chat de texto, y mueve el scroll del chat de texto hasta
     * el último mensaje.
     *
     * @param {String} mensaje Mensaje a añadir.
     *
     **/
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

        $("#mensajes").animate({
            scrollTop: $("#fin-mensajes").offset().top - $("#mensajes").offset().top + $("#mensajes").scrollTop()
        }, 300);
    }

    /**
     * @ngdoc method
     * @name getFeedback
     * @methodOf copernicus.function:ChatTextoManager
     * @description
     * Obtiene feedback de un mensaje enviado, de modo que el usuario puede saber el número de usuarios que recibieron
     * el mensaje.
     *
     * @param {object} feedback Feedback del mensaje enviado.
     *
     **/
    this.getFeedback = function (feedback) {

        if (feedback.mensaje.tipoMensaje == 'texto') {
            ($(".feedback-" + usernameUsuario)[0]).append(feedback.mensaje.participantes + " √");
        }

        else {
            if (feedback.mensaje == 1) {
                utils.mensajeInfo($translate.instant('FICHERO_ENVIADO_FEEDBACK')
                    + feedback.mensaje.participantes + " " + $translate.instant('USUARIO'));
            } else {
                utils.mensajeInfo($translate.instant('FICHERO_ENVIADO_FEEDBACK') +
                    feedback.mensaje.participantes + " " + $translate.instant('USUARIOS'));
            }
        }

        ($(".feedback-" + usernameUsuario)).removeClass('feedback-' + usernameUsuario);

    }

    /**
     * @ngdoc method
     * @name sendData
     * @methodOf copernicus.function:ChatTextoManager
     * @description
     * Envía un mensaje al resto de usuario conectados.
     *
     * @param {object} mensaje Mensaje a enviar.
     *
     **/
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

    /**
     * @ngdoc method
     * @name sendArchivo
     * @methodOf copernicus.function:ChatTextoManager
     * @description
     * Envía un archivo al resto de usuario conectados.
     *
     * @param {object} file Datos del archivo a enviar.
     * @param {object} contenido Contenido del archivo.
     * @param {String} tipo Tipo de archivo.
     *
     **/
    this.sendArchivo = function (file, contenido, tipo) {
        var fr = new FileReader();

        ws.send(JSON.stringify({
            'seccion': 'chatTexto',
            'data': {
                'tipo': tipo,
                'fichero': file.name,
                'contenido': contenido,
                'username': usernameUsuario,
                'sala': sala
            }
        }));

    };


}