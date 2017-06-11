var copernicus = angular.module('copernicus');

copernicus.controller("chatTextoController", function ($scope, $rootScope, webSocketService, utils, $translate) {

    var usuario = $rootScope.usuario;

    //Usuario almacenado por asistentesController en el rootScope
    webSocketService.chatTextoManager.setUsuario(usuario.username);
    $scope.usernameUsuario = usuario.username;

    //Id de la sala a la que se accedió
    var sala = JSON.parse(window.sessionStorage.getItem("salaSeleccionada")).idSala;
    webSocketService.chatTextoManager.setSala(sala);

    $scope.mensajes = webSocketService.chatTextoManager.getMensajes();

    $scope.sendMensaje = function (mensaje) {
        if (mensaje != "") {
            document.getElementById("texto-enviar").value = "";
            webSocketService.chatTextoManager.sendMensaje(mensaje);
            $scope.mensaje = "";
        }

    };

    $scope.enviarMensajeTeclado = function (event, mensaje) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $scope.sendMensaje(mensaje);
        }
    };


    $scope.uploadFiles = function (file, errFiles) {

        var fr = new FileReader();

        if (file)
            fr.readAsDataURL(file);
        else {
            console.log(errFiles);
            if (errFiles[0] && errFiles[0].$error == 'maxSize')
                utils.mensajeError($translate.instant('FICHERO_SIZE_MAXIMO'));
        }

        fr.onloadend = function () {

            console.log("Nombre: " + file.name);

            var tipoFichero;

            if (file) {
                switch (file.type) {
                    case "image/png":
                    case "image/gif":
                    case "image/jpeg":
                        console.log("Es una foto");
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