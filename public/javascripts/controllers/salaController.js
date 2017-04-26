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

    function error(res) {
        console.log(res);
    }

    $scope.selectedSala = function(){
        return JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));
    }


});

