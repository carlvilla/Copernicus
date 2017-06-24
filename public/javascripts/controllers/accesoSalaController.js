var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:AccesoSalaController
 *
 * @description
 * Este controlador es utilizado para comprobar que un acceso a una sala está autorizado.
 */
copernicus.controller('accesoSalaController', function ($scope, $rootScope, utils) {

    /**
     * @ngdoc property
     * @name salaSeleccionada
     * @propertyOf copernicus.controller:AccesoSalaController
     * @description
     * Almacena los datos sala seleccionada
     *
     **/
    var salaSeleccionada;

    /**
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:AccesoSalaController
     * @description
     * Inicializa el controlador, obteniendo los datos de la sala y almacenandolos en la propiedad 'salaSeleccionada',
     * y comprueba mediante el utils que el id de la sala exista y que el usuario sea participante.
     *
     **/
    inicializacion = function(){
        salaSeleccionada = JSON.parse(window.sessionStorage.getItem("salaSeleccionada"));

        //Comprobamos que existe el idSala, en caso contrario el usuario habrá accedido directamente a la
        //página de salas sin haber seleccionado una sala.
        //Cuando un usuario selecciona una sala para acceder a ella, se comprueba que este sigue tiendo permisos para
        //acceder a ella. Sin embargo, también es necesario volver a comprobar en este momento que el usuario tiene
        //permisos para acceder a la sala, ya que si el usuario modifica la información almacenada en la sesión
        //y accede a la página 'chatroom' directamente, se le permitirá el acceso.
        utils.checkIdSalaExists(salaSeleccionada);
        utils.checkParticipante(salaSeleccionada.idSala);

        $scope.salaSeleccionada = salaSeleccionada;
    }

    inicializacion();

});