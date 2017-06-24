var copernicus = angular.module('copernicus');

copernicus.controller('gestionarSalasController', function ($scope, $http, $window, utils, $translate) {

    var salaSeleccionada;

    //Variables necesarias para realizar el filtado de salas
    var salasAdmin;
    var salasModerador;
    var salasMiembro;

    $scope.foto;
    $scope.fotoRecortada = '';
    var fotoCambiada = false;
    var sizeMaxFoto = 8000000; //8MB

    $scope.contactosAdded = [];

    function error(res) {
        utils.mensajeError($translate.instant('OPERACION_NO_AUTORIZADA'));
    }

    var inicializacion = function(){

        $http({
            method: "GET",
            url: "api/salasAdmin"
        }).then(function (res) {
            $scope.salasAdmin = res.data;
            salasAdmin = res.data;
        }, error)

        $http({
            method: "GET",
            url: "api/salasModerador"
        }).then(function (res) {
            $scope.salasModerador = res.data;
            salasModerador = res.data;
        }, error)

        $http({
            method: "GET",
            url: "api/salasMiembro"
        }).then(function (res) {
            $scope.salasMiembro = res.data;
            salasMiembro = res.data;
        }, error)


    }

    inicializacion();

    /**
     * Muestra la información de una sala
     * @param idSala
     * @param permisos
     */
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
     * Elimina un usuario de la sala
     * @param usuario
     */
    $scope.eliminarUsuario = function (username) {
        $http({
            method: "POST",
            url: "api/eliminarUsuarioSala",
            data: {
                idSala: salaSeleccionada,
                username: username
            }
        }).then(function (res) {
            $scope.participantes.forEach(function (participante) {
                if (participante.user.username == username) {
                    $scope.participantes.splice($scope.participantes.indexOf(participante), 1);
                    utils.mensajeSuccess($translate.instant('USUARIO_ELIMINADO'));
                }
            })
        });
    }

    /**
     * Actualiza la información de una sala
     */
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
     * Utilizado para salir de una sala
     */
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
     * Elimina la sala
     */
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
     * Cambia los permisos de un participante
     * @param participante
     */
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
     * Cambiar permisos solicitud
     * @param candidato
     */
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
     * Comprueba si un usuario ya participa en una sala o se le ha mandado una solicitud
     * @param usuario
     * @returns {boolean}
     */
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
     * Manda una solicitud de unión a la sala
     */
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
     * Comprueba si se alcanzó el límite de personas en una sala
     *
     * @returns {boolean}
     */
    function comprobarLimiteSala() {
        if (($scope.participantes.length + $scope.candidatos.length) == 4) {
            utils.mensajeInfo($translate.instant("LIMITE_SALA"));
            return false;
        } else {
            return true;
        }
    }


    /**
     * Elimina una solicitud de unión a la sala
     * @param usuario
     */
    $scope.eliminarSolicitudSala = function (username) {

        console.log("Eliminar solicitud: " + username);

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

    var findContactos = function () {
        $http({
            method: "GET",
            url: "api/contactos"
        }).then(success, error);

        function success(res) {
            if (!(res.data == "")) {
                $scope.contactos = res.data;
            }
        }

        function error(res) {
            //console.log(res);
        }
    }

    findContactos();


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
     * Filtrar salas en las que el usuario es administrador
     */
    $scope.filtrarAdmin = function () {
        $scope.salasAdmin = salasAdmin.filter(function (sala) {
            var nombreSala = sala.nombre.toLowerCase();
            var stringFiltrar = $('#filtrar-admin').val().toLowerCase();
            return nombreSala.indexOf(stringFiltrar) !== -1;
        });
    }

    /**
     * Filtrar salas en las que el usuario es moderador
     */
    $scope.filtrarModerador = function () {
        $scope.salasModerador = salasModerador.filter(function (sala) {
            var nombreSala = sala.nombre.toLowerCase();
            var stringFiltrar = $('#filtrar-moderador').val().toLowerCase();
            return nombreSala.indexOf(stringFiltrar) !== -1;
        });
    }

    /**
     * Filtrar salas en las que el usuario es miembro
     */
    $scope.filtrarMiembro = function () {
        $scope.salasMiembro = salasMiembro.filter(function (sala) {
            var nombreSala = sala.nombre.toLowerCase();
            var stringFiltrar = $('#filtrar-miembro').val().toLowerCase();
            return nombreSala.indexOf(stringFiltrar) !== -1;
        });
    }

});