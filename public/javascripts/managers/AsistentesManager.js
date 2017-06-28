/**
 * @ngdoc function
 * @name copernicus.function:AsistentesManager
 * @description
 * Este manager se encarga de la gestión de los asistentes a una sala
 */
function AsistentesManager(ws) {

    /**
     * @ngdoc property
     * @name asistentes
     * @propertyOf copernicus.function:AsistentesManager
     * @description
     * Listado de asistentes a una sala.
     *
     **/
    var asistentes = [];

    /**
     * @ngdoc property
     * @name usuario
     * @propertyOf copernicus.function:AsistentesManager
     * @description
     * Datos del usuario.
     *
     **/
    var usuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.function:AsistentesManager
     * @description
     * Datos de la sala.
     *
     **/
    var sala;

    /**
     * @ngdoc method
     * @name salaSeleccionada
     * @methodOf copernicus.function:AsistentesManager
     * @description
     * Añadir asistentes a la sala.
     *
     * @param {object} Asistente que se acaba de unir a la sala.
     *
     **/
    this.addAsistente = function (asistente) {
        //Es necesario comprobar que el usuario no esté ya incluido en la lista de asistentes, ya que
        //si el usuario refresca la página se intentará añadir de nuevo el mismo.
        var nuevoAsistente = true;

        asistentes.forEach(function(asis){
            if(asis.username == asistente.username){
                nuevoAsistente = false;
            }
        })

        if(nuevoAsistente) {
            asistentes.push(asistente);
        }
    }

    /**
     * @ngdoc method
     * @name getAsistentes
     * @methodOf copernicus.function:AsistentesManager
     * @description
     * Obtiene los asistentes de la sala
     *
     * @return {object[]} Array con los asistentes de la sala.
     *
     **/
    this.getAsistentes = function () {
        return asistentes;
    }

    /**
     * @ngdoc method
     * @name deleteAsistente
     * @methodOf copernicus.function:AsistentesManager
     * @description
     * Elimina un asistente del array de asistentes.
     *
     * @param {object} Asistente Asistente que abandonó la sala.
     *
     **/
    this.deleteAsistente = function (asistente) {
        console.log("Eliminar asistente");
        for (var index in asistentes) {
            if (asistentes[index].username == asistente.username) {
                asistentes.splice(index, 1);
            }
        }
    }

    /**
     * @ngdoc method
     * @name setConectado
     * @methodOf copernicus.function:AsistentesManager
     * @description
     * Comunica a los demás usuarios de la sala que el usuario está conectado.
     *
     * @param {String} username Nombre de usuario del usuario.
     * @param {String} nombre Nombre del usuario.
     * @param {String} salaParam ID de la sala.
     *
     **/
    this.setConectado = function (username, nombre, salaParam) {
        usuario = {
            'username': username,
            'nombre': nombre
        };

        sala = salaParam;

        sendData(username, nombre, sala, 'connected');
    };

    /**
     * @ngdoc method
     * @name setDesconectado
     * @methodOf copernicus.function:AsistentesManager
     * @description
     * Indicar a los demás usuarios que el usuario ya está conectado a la sala.
     *
     **/
    this.setDesconectado = function () {
        this.deleteAsistente(usuario);
        sendData(usuario.username, usuario.nombre, sala, 'disconnected');
    };


    /**
     *
     *
     * @param userName
     * @param name
     * @param operation
     */

    /**
     * @ngdoc method
     * @name sendData
     * @methodOf copernicus.function:AsistentesManager
     * @description
     * Método para enviar mensajes al servidor de WebSockets.
     *
     * @param {String} username Nombre de usuario del usuario.
     * @param {String} nombre Nombre del usuario.
     * @param {String} sala ID de la sala.
     * @param {String} operacion Operación realizada.
     *
     **/
    function sendData(username, nombre, sala, operacion) {
        ws.send(
            JSON.stringify({
                'seccion': 'asistentes',
                'data': {
                    'operacion': operacion,
                    'nombre': nombre,
                    'username': username,
                    'sala': sala
                }}));
    }

}