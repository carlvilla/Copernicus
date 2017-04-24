function AsistentesManager(ws) {

    var asistentes = [];
    var usuarioConectado;

    /**
     * Añadir asistentes a la sala
     * @param asistente
     */
    this.addAsistente = function (asistente) {
        //Es necesario comprobar que el usuario no esté ya incluido en la lista de asistentes, ya que
        //si el usuario refresca la página se intentará añadir de nuevo el mismo.
        var nuevoAsistente = true;

        asistentes.forEach(function(asis){
            if(asis.username == asistente.username){
                nuevoAsistente = false;
            }
        })

        if(nuevoAsistente)
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
        console.log("Eliminar asistente");
        console.log(asistentes);
        for (var index in asistentes) {
            if (asistentes[index].username == asistente.username) {
                console.log(asistente.username);
                asistentes.splice(index, 1);
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