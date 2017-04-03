function PeopleManagement(ws, growl) {

    var asistentes = [];
    var usuario;

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
        usuario = {
            'username': username,
            'name': nombre
        };

        this.addPerson(user);
        sendData(userName, name, 'connected');
    };


    /**
     * Indicar que el usuario ya no es un asistente
     */
    this.setConnected = function () {
        this.deletePerson(usuario);
        sendData(userName, name, 'disconnected');
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