function AsistentesManager(ws) {

    var asistentes = [];
    var usuarioConectado;

    /**
     * Añadir asistentes a la sala
     * @param asistente
     */
    this.addAsistente = function (asistente) {
        asistentes.push(asistente);
    }

    /**
     * Obtener asistentes de la sala
     * @returns {Array}
     */
    this.getAsistentes = function () {
        return asistentes;
    }

    /**
     * Eliminar asistentes de la sala
     * @param asistente
     */
    this.deleteAsistente = function (asistente) {
        for (var a in asistentes) {
            if (a.username == asistente.username) {
                asistentes.splice(asistentes.indexOf(a), 1);
            }
        }
    }

    /**
     * Indicar que el usuario es un asistente
     * @param username
     * @param nombre
     */
    this.setConnected = function (username, nombre) {
        usuarioConectado = {
            'username': username,
            'nombre': nombre
        };

        sendData(username, nombre, 'connected');
    };


    /**
     * Indicar que el usuario ya no es un asistente
     */
    this.setDisconnected = function () {
        this.deleteAsistente(usuarioConectado);
        sendData(usuarioConectado.username, usuarioConectado.nombre, 'disconnected');
    };


    /**
     * Método para enviar mensajes al servidor de WebSockets
     *
     * @param userName
     * @param name
     * @param operation
     */
    function sendData(username, nombre, operacion) {
        ws.send(
            JSON.stringify({
                'seccion': 'asistentes',
                'data': {
                    'operacion': operacion,
                    'nombre': nombre,
                    'username': username
                }}));
    }

}