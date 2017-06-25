var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:addContactoController
 *
 * @description
 * Controlador encargado de la gestión de las solicitudes de contacto.
 */
copernicus.controller('addContactoController', function ($scope, $http, utils, $translate) {

    /**
     * @ngdoc property
     * @name usuarios
     * @propertyOf copernicus.controller:addContactoController
     * @description
     * Almacena los posibles contactos a los que el usuario puede enviar una solicitud de contacto.
     *
     **/
    $scope.usuarios = {};

    /**
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:addContactoController
     * @description
     * Inicializa el controlador, obteniendo los usuarios que pueden ser nuevos contactos del usuario y almacenandolos
     * en la variable usuarios.
     *
     **/
    var inicializacion = function(){
        $http({
            method: "GET",
            url: "api/posiblesContactos"
        }).then(success, error);

        function success(res) {
            if(!(res.data == "")){
                $scope.usuarios = res.data;
            }
        }

        function error(res) {
            utils.checkDatabaseError(res);
        }
    }

    inicializacion();

    /**
     * @ngdoc method
     * @name enviarSolicitudContacto
     * @methodOf copernicus.controller:addContactoController
     * @description
     * Envía una solicitud de contacto a un usuario previamente seleccionado.
     *
     **/
    $scope.enviarSolicitudContacto = function () {

        var datos = $scope.usuarioSeleccionado.originalObject;

        datos.mensaje = $scope.mensaje;

        $http({
            method: "POST",
            url: "api/enviarSolicitudContacto",
            data: angular.toJson(datos)
        }).then(function (res) {

            utils.mensajeInfo($translate.instant("SOLICITUD_CONTACTO_ENVIADA"));

            //Es necesario borrar de la lista al usuario al que acabamos de mandar la solicitud, sino
            //nos volverá a dejar envirle otra
            for(var i=0;i<$scope.usuarios.length;i++){
                if($scope.usuarios[i].username == datos.username){
                    $scope.usuarios.splice($scope.usuarios.indexOf($scope.usuarios[i]),1);
                }
            }

            //Se restablecen variables para enviar otras solicitudes
            $('#username-solicitud-contacto_value').val('');
            $('#mensaje-solicitud-contacto').val('');
            $scope.usuarioSeleccionado = undefined;
            $scope.mensaje = undefined;


        }, function (res) {
            utils.mensajeError($translate.instant("SOLICITUD_CONTACTO_NO_ENVIADA"));
        });


    }

});