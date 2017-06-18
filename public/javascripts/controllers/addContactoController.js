/**
 * Created by carlosvillablanco on 19/04/2017.
 */

var copernicus = angular.module('copernicus');

copernicus.controller('solicitudContactoController', function ($scope, $http, utils, $translate) {

    $scope.usuarios = {};

    var inicializacion = function(){
        $http({
            method: "GET",
            url: "api/findPosiblesContactos"
        }).then(success, error);

        function success(res) {
            if(!(res.data == "")){
                $scope.usuarios = res.data;
            }
        }

        function error(res) {
            //console.log(res);
        }
    }

    inicializacion();

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



        }, function (res) {
            utils.mensajeError($translate.instant("SOLICITUD_CONTACTO_NO_ENVIADA"));
        });




    }

});