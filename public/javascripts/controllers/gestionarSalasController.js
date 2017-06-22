var copernicus = angular.module('copernicus');

copernicus.controller('gestionarSalasController', function ($scope, $http, $window, utils, $translate) {

    var idSalaSeleccionada;

    //Variables necesarias para realizar el filtado de salas
    var todasSalasAdmin;
    var todasSalasModerador;
    var todasSalasMiembro;

    function error(res) {
        utils.mensajeError($translate.instant('OPERACION_NO_AUTORIZADA'));
    }

    $http({
        method: "GET",
        url: "api/salasAdmin"
    }).then(function (res) {
        $scope.salasAdmin = res.data;
        todasSalasAdmin = res.data;
    }, error)

    $http({
        method: "GET",
        url: "api/salasModerador"
    }).then(function (res) {
        $scope.salasModerador = res.data;
        todasSalasModerador = res.data;
    }, error)

    $http({
        method: "GET",
        url: "api/salasMiembro"
    }).then(function (res) {
        $scope.salasMiembro = res.data;
        todasSalasMiembro = res.data;
    }, error)


    $scope.mostrarInfoSala = function (idSala, permisos) {
        idSalaSeleccionada = idSala;
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

    $scope.eliminarUsuario = function (usuario) {
        $http({
            method: "POST",
            url: "api/eliminarUsuarioSala",
            data: {
                idSala: idSalaSeleccionada,
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

    $scope.actualizarSala = function () {
        if (fotoCambiada) {
            utils.mensajeInfo($translate.instant('ACTUALIZANDO_SALA'));
        }

        $http({
            method: "POST",
            url: "api/actualizarSala",
            data: {
                idSala: idSalaSeleccionada,
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

    $scope.salirSala = function () {
        $http({
            method: "POST",
            url: "api/eliminarUsuarioSala",
            data: {
                idSala: idSalaSeleccionada,
            }
        }).then(function (res) {
            utils.mensajeSuccess($translate.instant("SALIO_SALA"));
            $window.location.reload();
        }, error);
    };


    $scope.eliminarSala = function () {
        $http({
            method: "POST",
            url: "api/eliminarSala",
            data: {
                idSala: idSalaSeleccionada,
            }
        }).then(function (res) {
            $scope.salasAdmin.every(function (sala) {
                utils.mensajeSuccess($translate.instant("SALA_ELIMINADA"));
                $window.location.reload();
            });
        }, error);
    };

    $scope.cambiarPermisos = function (participante) {
        $http({
            method: "POST",
            url: "api/cambiarPermisos",
            data: {
                idSala: idSalaSeleccionada,
                username: participante.username,
                permisos: participante.permisos,
            }
        }).then(function (res) {
            utils.mensajeSuccess($translate.instant("PERMISOS_USUARIO_CAMBIADOS"));
        }, error)

    }


    $scope.cambiarPermisosSolicitud = function (candidato) {
        $http({
            method: "POST",
            url: "api/cambiarPermisosSolicitud",
            data: {
                idSala: idSalaSeleccionada,
                username: candidato.user.username,
                permisos: candidato.rel.properties.permisos,
            }
        }).then(function (res) {
            utils.mensajeSuccess($translate.instant("PERMISOS_USUARIO_CAMBIADOS"));
        }, error)

    }


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

    $scope.contactosAdded = [];

    $scope.addCandidato = function () {
        if ($scope.usuarioSeleccionado != undefined && comprobarLimiteSala()) {
            var usuario = {user: $scope.usuarioSeleccionado.originalObject, rel: {properties: {permisos: 'Miembro'}}};

            //Si el usuario no se incluyó todavía
            if ($scope.contactosAdded.indexOf(usuario) == -1 && !added(usuario)) {

                $http({
                    method: "POST",
                    url: "api/enviarSolicitudSala",
                    data: {
                        idSala: idSalaSeleccionada,
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


    $scope.eliminarSolicitudSala = function (usuario) {

        console.log("Eliminar solicitud: " + usuario.username);

        $http({
            method: "POST",
            url: "api/eliminarSolicitudSala",
            data: {
                idSala: idSalaSeleccionada,
                username: usuario.username
            }
        }).then(function () {
            $scope.candidatos.forEach(function (candidato) {
                if (candidato.user.username == usuario.username) {
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

    $scope.foto;
    $scope.fotoRecortada = '';
    var fotoCambiada = false;
    var sizeMaxFoto = 8000000; //8MB

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


    $scope.filtrarAdmin = function () {
        $scope.salasAdmin = todasSalasAdmin.filter(function (sala) {
            var nombreSala = sala.nombre.toLowerCase();
            var stringFiltrar = $('#filtrar-admin').val().toLowerCase();
            return nombreSala.indexOf(stringFiltrar) !== -1;
        });
    }

    $scope.filtrarModerador = function () {
        $scope.salasModerador = todasSalasModerador.filter(function (sala) {
            var nombreSala = sala.nombre.toLowerCase();
            var stringFiltrar = $('#filtrar-moderador').val().toLowerCase();
            return nombreSala.indexOf(stringFiltrar) !== -1;
        });
    }

    $scope.filtrarMiembro = function () {
        $scope.salasMiembro = todasSalasMiembro.filter(function (sala) {
            var nombreSala = sala.nombre.toLowerCase();
            var stringFiltrar = $('#filtrar-miembro').val().toLowerCase();
            return nombreSala.indexOf(stringFiltrar) !== -1;
        });
    }

});