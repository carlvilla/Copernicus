/**
 * Created by carlosvillablanco on 24/03/2017.
 */
var webApp = angular.module('webApp');

webApp.controller('salaController', function ($scope, $http, $window) {

    $http({
        method: "GET",
        url: "api/salasParticipa"
    }).then(success, error)


    function success(res) {
        $scope.salas = res.data;
    }

    $scope.accederSala = function (idSala) {
        $http({
            method: "POST",
            url: "api/chatroom",
            data: angular.toJson({idSala: idSala})
        }).then(successAcceso, error)
    }

    function successAcceso(res) {
        window.sessionStorage.setItem("salaSeleccionada", JSON.stringify(res.data[0]));
        $window.location.href ='/chatroom';
    }

    $scope.crearSala = function (sala) {
        $http({
            method: "POST",
            url: "api/createChatroom",
            data: angular.toJson(sala)
        }).then(successCrear, error)
    }

    function successCrear(res) {
        window.sessionStorage.setItem("salaSeleccionada", JSON.stringify(res.data[0]));
        $window.location.href ='/chatroom';
    }

    $scope.contactos = {};
    $scope.contactosSeleccionados = [];

    $scope.addContactoTabla = function(){
        if($scope.usuarioSeleccionado != undefined) {
            var usuario = $scope.usuarioSeleccionado.originalObject;

            //Si el usuario no se incluyó todavía
            if ($scope.contactosSeleccionados.indexOf(usuario) == -1)
                $scope.contactosSeleccionados.push(usuario);
        }
    }

    $scope.eliminarSeleccionado = function(username){
        $scope.contactosSeleccionados.forEach(function(usuario){
           if(usuario.username == username){
               var index = $scope.contactosSeleccionados.indexOf(usuario);
               $scope.contactosSeleccionados.splice(index, 1);
           }
        });
    }

    var findContactos = function(){
        $http({
            method: "GET",
            url: "api/contactos"
        }).then(success, error);

        function success(res) {
            if(!(res.data == "")){
                $scope.contactos = res.data;
            }
        }

        function error(res) {
            console.log(res);
        }
    }

    findContactos();




    function error(res) {
        console.log(res);
    }

    $scope.selectedSala = function(){
        return JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));
    }


});

