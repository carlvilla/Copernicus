/**
 * Created by carlosvillablanco on 19/04/2017.
 */

var copernicus = angular.module('copernicus');

copernicus.controller('solicitudContactoController', function ($scope, $http) {

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
            console.log(res);
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
        });


        //Es necesario borrar de la lista al usuario al que acabamos de mandar la solicitud, sino
        //nos volverá a dejar envirle otra
        for(var i=0;i<$scope.usuarios.length;i++){
            if($scope.usuarios[i].username == datos.username){
                $scope.usuarios.splice($scope.usuarios.indexOf($scope.usuarios[i]),1);
            }
        }

    }

});