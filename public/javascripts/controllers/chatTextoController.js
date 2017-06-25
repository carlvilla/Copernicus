var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:chatTextoController
 *
 * @description
 * Este controlador es utilizado para comunicar al usuario con 'ChatTextoManager', de modo que pueda enviar y recibir
 * mensajes y archivos.
 */

copernicus.controller("chatTextoController", function ($scope, $rootScope, webSocketService, utils, $translate) {

    /**
     * @ngdoc property
     * @name usuario
     * @propertyOf copernicus.controller:chatTextoController
     * @description
     * Usuario que está utilizando la sala.
     *
     **/
    var usuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.controller:chatTextoController
     * @description
     * Id de la sala a la que se accedió.
     *
     **/
    var sala;

    /**
     * @ngdoc property
     * @name mensajes
     * @propertyOf copernicus.controller:chatTextoController
     * @description
     * Mensajes del chat de texto.
     *
     **/
    $scope.mensajes = {};

    /**
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:chatTextoController
     * @description
     * Inicializa el controlador. Se encarga de inicializar el 'ChatTextoManager' pasandole el nombre de usuario y la
     * sala, y recibe los mensajes enviados.
     *
     **/
    var inicializacion = function(){
        usuario = $rootScope.usuario;

        $scope.usernameUsuario = usuario.username;

        sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));

        webSocketService.chatTextoManager.inicializar(usuario.username, sala.idSala);

        $scope.mensajes = webSocketService.chatTextoManager.getMensajes();

    }

    inicializacion();


    /**
     * @ngdoc method
     * @name enviarMensaje
     * @methodOf copernicus.controller:chatTextoController
     * @description
     * Envía un mensaje del usuario.
     *
     * @param {String} mensaje Mensaje enviado por el usuario.
     *
     **/
    $scope.enviarMensaje = function (mensaje) {
        if (mensaje != "") {
            document.getElementById("texto-enviar").value = "";
            webSocketService.chatTextoManager.enviarMensaje(mensaje);
            $scope.mensaje = "";
        }

    };

    /**
     * @ngdoc method
     * @name enviarMensajeTeclado
     * @methodOf copernicus.controller:chatTextoController
     * @description
     * Envía un mensaje del usuario al pulsar Enter en el teclado.
     *
     * @param {object} event Evento ocasionado al pulsar una tecla.
     * @param {String} mensaje Mensaje enviado por el usuario.
     *
     **/
    $scope.enviarMensajeTeclado = function (event, mensaje) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $scope.enviarMensaje(mensaje);
        }
    };

    /**
     * @ngdoc method
     * @name enviarFichero
     * @methodOf copernicus.controller:chatTextoController
     * @description
     * Envía un fichero.
     *
     * @param {object} file Fichero que el usuario envía
     * @param {object} errFiles Error al recibir el fichero.
     *
     **/
    $scope.enviarFichero = function (file, errFiles) {

        var fr = new FileReader();

        if (file)
            fr.readAsDataURL(file);
        else {
            if (errFiles[0] && errFiles[0].$error == 'maxSize')
                utils.mensajeError($translate.instant('FICHERO_SIZE_MAXIMO'));
        }

        fr.onloadend = function () {

            var tipoFichero;

            if (file) {
                switch (file.type) {
                    case "image/png":
                    case "image/gif":
                    case "image/jpeg":
                        tipoFichero = "foto";
                        webSocketService.chatTextoManager.sendArchivo(file, fr.result, tipoFichero);
                        break;

                    default:
                        tipoFichero = "archivo";
                        webSocketService.chatTextoManager.sendArchivo(file, fr.result, tipoFichero);
                        break;
                }

                //Es necesario añadir el archivo directamente desde el controlador debido a que no es posible
                //utilizar $scope.$appply en el manager. Para poder mostrar el archivo al usuario que lo manda,
                //es necesario esperar a se ejecute el evento fr.onloadend, pero si simplemente se añade el mensaje al
                //array en fr.onloadend no se actualiza correctamente la vista. Utilizando $scope.$apply este problema
                //se soluciona.
                $scope.$apply(function () {
                    $scope.mensajes.push({
                        username: usuario.username,
                        tipo: tipoFichero,
                        fichero: file.name,
                        contenido: fr.result
                    });
                });
            }
        };
    }

});