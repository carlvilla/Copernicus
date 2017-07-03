var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:gestionarSalasController
 *
 * @description
 * Este controlador es utilizado para permitir a los usuarios realizar todas las operaciones de gestión de salas.
 */
copernicus.controller('gestionarSalasController', function ($scope, $http, $window, utils, $translate) {


    /**
     * @ngdoc property
     * @name salaSeleccionada
     * @propertyOf copernicus.controller:gestionarSalasController
     * @description
     * Almacena los datos de la sala seleccionada
     *
     **/
    var salaSeleccionada;

    //Variables necesarias para realizar el filtado de salas

    /**
     * @ngdoc property
     * @name salasAdminFiltrado
     * @propertyOf copernicus.controller:gestionarSalasController
     * @description
     * Atributo necesario para permitir el filtrado de las salas donde el usuario es administrador.
     *
     **/
    var salasAdminFiltrado;

    /**
     * @ngdoc property
     * @name salasModeradorFiltrado
     * @propertyOf copernicus.controller:gestionarSalasController
     * @description
     * Atributo necesario para permitir el filtrado de las salas donde el usuario es moderador.
     *
     **/
    var salasModeradorFiltrado;

    /**
     * @ngdoc property
     * @name salasMiembroFiltrado
     * @propertyOf copernicus.controller:gestionarSalasController
     * @description
     * Atributo necesario para permitir el filtrado de las salas donde el usuario es miembro.
     *
     **/
    var salasMiembroFiltrado;

    /**
     * @ngdoc property
     * @name foto
     * @propertyOf copernicus.controller:gestionarSalasController
     * @description
     * Foto seleccionada por el usuario.
     *
     **/
    $scope.foto;

    /**
     * @ngdoc property
     * @name fotoRecortada
     * @propertyOf copernicus.controller:gestionarSalasController
     * @description
     * Recorte de la foto seleccionada por el usuario.
     *
     **/
    $scope.fotoRecortada = '';

    /**
     * @ngdoc property
     * @name fotoCambiada
     * @propertyOf copernicus.controller:gestionarSalasController
     * @description
     * Booleano que indica si la foto de la sala fue cambiada.
     *
     **/
    var fotoCambiada = false;

    /**
     * @ngdoc property
     * @name sizeMaxFoto
     * @propertyOf copernicus.controller:gestionarSalasController
     * @description
     * Entero que indica el tamaño máximo de la foto de la sala.
     *
     **/
    var sizeMaxFoto = 8000000; //8MB

    /**
     * @ngdoc property
     * @name salasAdmin
     * @propertyOf copernicus.controller:gestionarSalasController
     * @description
     * Salas en las que el usuario es administrador.
     *
     **/
    $scope.salasAdmin;

    /**
     * @ngdoc property
     * @name salasModerador
     * @propertyOf copernicus.controller:gestionarSalasController
     * @description
     * Salas en las que el usuario es moderador.
     *
     **/
    $scope.salasModerador;

    /**
     * @ngdoc property
     * @name salasMiembro
     * @propertyOf copernicus.controller:gestionarSalasController
     * @description
     * Salas en las que el usuario es miembro.
     *
     **/
    $scope.salasMiembro;

    /**
     * @ngdoc property
     * @name contactosAdded
     * @propertyOf copernicus.controller:gestionarSalasController
     * @description
     * Contactos a los que el usuario acaba de mandar una solicitud de unión a la sala.
     *
     **/
    $scope.contactosAdded = [];

    /**
     * @ngdoc method
     * @name error
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Muestra un mensaje de error en el caso de que una operación no fue autorizada.
     *
     * @param {object} res Respuesta de la API REST
     *
     **/
    function error(res) {
        utils.mensajeError($translate.instant('OPERACION_NO_AUTORIZADA'));
    }

    /**
     * @ngdoc method
     * @name inicializacion
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Inicializa el controlador, obteniendo las salas en las que el usuario es administrado, moderador y miembro.
     *
     **/
    var inicializacion = function(){

        $http({
            method: "GET",
            url: "api/salasAdmin"
        }).then(function (res) {
            $scope.salasAdmin = res.data;
            salasAdminFiltrado = res.data;
        }, error)

        $http({
            method: "GET",
            url: "api/salasModerador"
        }).then(function (res) {
            $scope.salasModerador = res.data;
            salasModeradorFiltrado = res.data;
        }, error)

        $http({
            method: "GET",
            url: "api/salasMiembro"
        }).then(function (res) {
            $scope.salasMiembro = res.data;
            salasMiembroFiltrado = res.data;
        }, error)


    }

    inicializacion();

    /**
     * @ngdoc method
     * @name mostrarInfoSala
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Muestra la información de una sala.
     *
     * @param {String} idSala Sala que se quiere mostrar.
     * @param {String} permisos Permisos de los que dispone el usuario en la sala.
     *
     **/
    $scope.mostrarInfoSala = function (idSala, permisos) {
        salaSeleccionada = idSala;
        $scope.foto = undefined;


        switch (permisos) {
            case 'admin':
                ($scope.salasAdmin).forEach(function (sala) {
                    if (sala.idSala == idSala) {
                        $scope.salaSeleccionada = sala;
                    }
                });
                break;

            case 'moderador':
                $scope.salasModerador.forEach(function (sala) {
                    if (sala.idSala == idSala) {
                        $scope.salaSeleccionada = sala;
                    }
                });
                break;

            case 'miembro':
                $scope.salasMiembro.forEach(function (sala) {
                    if (sala.idSala == idSala) {
                        $scope.salaSeleccionada = sala;
                    }
                });
                break;

        }

        $http({
            method: "POST",
            url: "api/participantesSala",
            data: {idSala: idSala}
        }).then(function (res) {
            $scope.participantes = res.data;

            if (permisos == 'admin') {
                $scope.admin = true;
                $scope.miembro = false;
            }
            else {
                $scope.admin = false;
                if (permisos == 'miembro') {
                    $scope.miembro = true;
                } else {
                    $scope.miembro = false;
                }
            }

            $http({
                method: "POST",
                url: "api/candidatos",
                data: {idSala: idSala}
            }).then(function (res) {
                $scope.candidatos = res.data;
            }, error);
        }, error)
    };

    /**
     * @ngdoc method
     * @name eliminarUsuario
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Elimina un usuario de la sala
     *
     * @param {String} username Nombre del usuario a eliminar de la sala.
     *
     **/
    $scope.eliminarUsuario = function (usuario) {

        $http({
            method: "POST",
            url: "api/eliminarUsuarioSala",
            data: {
                idSala: salaSeleccionada,
                username: usuario.username
            }
        }).then(function (res) {
            $scope.participantes.forEach(function (participante) {
                if (participante.user.username == usuario.username) {
                    $scope.participantes.splice($scope.participantes.indexOf(participante), 1);
                    utils.mensajeSuccess($translate.instant('USUARIO_ELIMINADO'));
                }
            })
        });
    }

    /**
     * @ngdoc method
     * @name actualizarSala
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Actualiza la información de una sala
     *
     **/
    $scope.actualizarSala = function () {
        if (fotoCambiada) {
            utils.mensajeInfo($translate.instant('ACTUALIZANDO_SALA'));
        }

        $http({
            method: "POST",
            url: "api/actualizarSala",
            data: {
                idSala: salaSeleccionada,
                nombre: $scope.salaSeleccionada.nombre,
                descripcion: $scope.salaSeleccionada.descripcion,
                foto: $scope.fotoRecortada,
                fotoCambiada: fotoCambiada
            }
        }).then(
            function () {
                utils.mensajeSuccess($translate.instant('DATOS_SALA_ACTUALIZADOS'));

                if (fotoCambiada) {
                    $window.location.reload();
                }

            }, function (err) {
                switch (err.data) {
                    case 'nombre':
                        utils.mensajeError('NOMBRE_SALA_NO_VACIO');
                        break;
                }
            }
        )
        ;
    }

    /**
     * @ngdoc method
     * @name salirSala
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Utilizado para salir de una sala
     *
     **/
    $scope.salirSala = function () {
        $http({
            method: "POST",
            url: "api/eliminarUsuarioSala",
            data: {
                idSala: salaSeleccionada,
            }
        }).then(function (res) {
            utils.mensajeSuccess($translate.instant("SALIO_SALA"));
            $window.location.reload();
        }, error);
    };

    /**
     * @ngdoc method
     * @name eliminarSala
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Elimina la sala seleccionada.
     *
     **/
    $scope.eliminarSala = function () {
        $http({
            method: "POST",
            url: "api/eliminarSala",
            data: {
                idSala: salaSeleccionada,
            }
        }).then(function (res) {
            $scope.salasAdmin.every(function (sala) {
                utils.mensajeSuccess($translate.instant("SALA_ELIMINADA"));
                $window.location.reload();
            });
        }, error);
    };

    /**
     * @ngdoc method
     * @name cambiarPermisos
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Elimina la sala seleccionada
     *
     * @param {object} participante Objeto con el participante al que se le cambian los permisos y los nuevos permisos
     * que se le otorgan.
     *
     **/
    $scope.cambiarPermisos = function (participante) {
        $http({
            method: "POST",
            url: "api/cambiarPermisos",
            data: {
                idSala: salaSeleccionada,
                username: participante.username,
                permisos: participante.permisos,
            }
        }).then(function (res) {
            utils.mensajeSuccess($translate.instant("PERMISOS_USUARIO_CAMBIADOS"));
        }, error)
    }

    /**
     * @ngdoc method
     * @name cambiarPermisosSolicitud
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Cambiar los permisos de una solicitud de unión a salas.
     *
     * @param {object} candidato Objeto con el usuario cuyos permisos de la solicitud de unión a la sala se
     * modifican y los nuevos permisos que se otorgan.
     *
     **/
    $scope.cambiarPermisosSolicitud = function (candidato) {
        $http({
            method: "POST",
            url: "api/cambiarPermisosSolicitud",
            data: {
                idSala: salaSeleccionada,
                username: candidato.user.username,
                permisos: candidato.rel.properties.permisos,
            }
        }).then(function (res) {
            utils.mensajeSuccess($translate.instant("PERMISOS_USUARIO_CAMBIADOS"));
        }, error)

    }

    /**
     * @ngdoc method
     * @name added
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Comprueba si un usuario ya fue añadido a una sala o si ya se le mandó una solicitud de unión.
     *
     * @param {object} usuario Datos del usuario.
     * @return {boolean} Indica si el usuario ya fue añadido a una sala o si ya se le mandó una solicitud de unión.
     *
     **/
    var added = function (usuario) {
        var added = false;

        $scope.participantes.every(function (participante) {
            if (participante.user.username == usuario.user.username) {
                added = true;
                utils.mensajeError($translate.instant("USUARIO_ALREADY_ADDED"));
                return false;
            }
            return true;
        })

        $scope.candidatos.every(function (candidato) {
            if (candidato.user.username == usuario.user.username) {
                added = true;
                utils.mensajeError($translate.instant("SOLICITUD_SALA_YA_ENVIADA"));
                return false;
            }
            return true;
        })


        return added;
    }

    /**
     * @ngdoc method
     * @name mandarSolicitud
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Manda una solicitud de unión a la sala
     *
     **/
    $scope.mandarSolicitud = function () {
        if ($scope.usuarioSeleccionado != undefined && comprobarLimiteSala()) {
            var usuario = {user: $scope.usuarioSeleccionado.originalObject, rel: {properties: {permisos: 'Miembro'}}};

            //Si el usuario no se incluyó todavía
            if ($scope.contactosAdded.indexOf(usuario) == -1 && !added(usuario)) {

                $http({
                    method: "POST",
                    url: "api/enviarSolicitudSala",
                    data: {
                        idSala: salaSeleccionada,
                        username: usuario.user.username
                    }
                })
                usuario.user.permisos = 'Miembro';
                $scope.contactosAdded.push(usuario);
                $scope.candidatos.push(usuario);

                utils.mensajeSuccess($translate.instant("SOLICITUD_ENVIADA"));

            }
        }
    };

    /**
     * @ngdoc method
     * @name comprobarLimiteSala
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Comprueba si se alcanzó el límite de personas en una sala.
     *
     * @return {boolean} Indica si se alcanzó o no el límite de la sala.
     *
     **/
    function comprobarLimiteSala() {
        if (($scope.participantes.length + $scope.candidatos.length) == 4) {
            utils.mensajeInfo($translate.instant("LIMITE_SALA"));
            return false;
        } else {
            return true;
        }
    }

    /**
     * @ngdoc method
     * @name eliminarSolicitudSala
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Elimina una solicitud de unión a la sala.
     *
     * @param {object} usuario Usuario cuya solicitud de unión a la sala es eliminada.
     *
     **/
    $scope.eliminarSolicitudSala = function (username) {
        $http({
            method: "POST",
            url: "api/eliminarSolicitudSala",
            data: {
                idSala: salaSeleccionada,
                username: username
            }
        }).then(function () {
            $scope.candidatos.forEach(function (candidato) {
                if (candidato.user.username == username) {
                    $scope.candidatos.splice($scope.candidatos.indexOf(candidato), 1);
                    utils.mensajeSuccess($translate.instant('SOLICITUD_ELIMINADA'));
                }
            })
        }, error)
    }

    /**
     * @ngdoc method
     * @name findContactos
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Busca los contactos del usuario
     *
     **/
    var findContactos = function () {
        $http({
            method: "GET",
            url: "api/contactos"
        }).then(success);

        function success(res) {
            if (!(res.data == "")) {
                $scope.contactos = res.data;
            }
        }
    }

    findContactos();

    /**
     * @ngdoc method
     * @name fotoSeleccionada
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Obtiene la foto para la sala seleccionada por el usuario, y comprueba si es válida.
     *
     * @param {object} evt Objeto que contiene la foto seleccionada.
     *
     **/
    var fotoSeleccionada = function (evt) {

        var size = document.getElementById('foto').files[0].size;

        if (size < sizeMaxFoto) {
            fotoCambiada = true;
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.foto = evt.target.result;
                });
            };
            reader.readAsDataURL(file);

        } else {
            utils.mensajeError($translate.instant("FOTO_SIZE_MAXIMO"));
        }


    };

    angular.element(document.querySelector('#foto')).on('change', fotoSeleccionada);

    /**
     * @ngdoc method
     * @name filtrarAdmin
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Filtrar salas en las que el usuario es administrador
     *
     **/
    $scope.filtrarAdmin = function () {
        $scope.salasAdmin = salasAdminFiltrado.filter(function (sala) {
            var nombreSala = sala.nombre.toLowerCase();
            var stringFiltrar = $('#filtrar-admin').val().toLowerCase();
            return nombreSala.indexOf(stringFiltrar) !== -1;
        });
    }

    /**
     * @ngdoc method
     * @name filtrarModerador
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Filtrar salas en las que el usuario es moderador
     *
     **/
    $scope.filtrarModerador = function () {
        $scope.salasModerador = salasModeradorFiltrado.filter(function (sala) {
            var nombreSala = sala.nombre.toLowerCase();
            var stringFiltrar = $('#filtrar-moderador').val().toLowerCase();
            return nombreSala.indexOf(stringFiltrar) !== -1;
        });
    }

    /**
     * @ngdoc method
     * @name filtrarModerador
     * @methodOf copernicus.controller:gestionarSalasController
     * @description
     * Filtrar salas en las que el usuario es miembro
     *
     **/
    $scope.filtrarMiembro = function () {
        $scope.salasMiembro = salasMiembroFiltrado.filter(function (sala) {
            var nombreSala = sala.nombre.toLowerCase();
            var stringFiltrar = $('#filtrar-miembro').val().toLowerCase();
            return nombreSala.indexOf(stringFiltrar) !== -1;
        });
    }

});