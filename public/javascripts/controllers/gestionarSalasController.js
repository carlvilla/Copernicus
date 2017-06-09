var webApp = angular.module('webApp');

webApp.controller('gestionarSalasController', function ($scope, $http, $window, utils, $translate) {

    var idSalaSeleccionada;

    //Variables necesarias para realizar el filtado de salas
    var todasSalasAdmin;
    var todasSalasModerador;

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

    $scope.mostrarInfoSala = function (idSala, admin) {
        idSalaSeleccionada = idSala;
        $scope.foto = undefined;

        if (admin) {
            ($scope.salasAdmin).forEach(function (sala) {
                if (sala.idSala == idSala) {
                    $scope.salaSeleccionada = sala;
                }
            })

        } else {
            $scope.salasModerador.forEach(function (sala) {
                if (sala.idSala == idSala) {
                    $scope.salaSeleccionada = sala;
                }
            })
        }

        $http({
            method: "POST",
            url: "api/participantesSala",
            data: {idSala: idSala}
        }).then(function (res) {
            $scope.participantes = res.data;
            $scope.admin = admin;


            $http({
                method: "POST",
                url: "api/candidatos",
                data: {idSala: idSala}
            }).then(function (res) {
                $scope.candidatos = res.data;
            }, error);
        }, error)
    };

    $scope.eliminarUsuarioSeleccionado = function (usuario) {
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

            }, error
        )
        ;
    }

    $scope.eliminarSala = function () {
        $http({
            method: "POST",
            url: "api/eliminarSala",
            data: {
                idSala: idSalaSeleccionada,
            }
        }).then(function (res) {
            $scope.salasAdmin.every(function (sala) {
                if (sala.idSala == idSalaSeleccionada) {
                    $scope.salasAdmin.splice($scope.salasAdmin.indexOf(sala), 1);
                    $scope.salaSeleccionada = undefined;
                    idSalaSeleccionada = undefined;
                    utils.mensajeSuccess($translate.instant("SALA_ELIMINADA"));
                    return false;
                }
                return true;
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


    $scope.cambiarPermisosCandidato = function (candidato) {
        $http({
            method: "POST",
            url: "api/cambiarPermisosCandidato",
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
                return false;
            }
            return true;
        })

        $scope.candidatos.every(function (candidato) {
            if (candidato.user.username == usuario.user.username) {
                added = true;
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
                    url: "api/enviarInvitacion",
                    data: {
                        idSala: idSalaSeleccionada,
                        username: usuario.user.username
                    }
                })
                usuario.user.permisos = 'Miembro';
                $scope.contactosAdded.push(usuario);
                $scope.candidatos.push(usuario);

                utils.mensajeSuccess($translate.instant("INVITACION_ENVIADA"));

            } else {
                utils.mensajeInfo($translate.instant("USUARIO_ALREADY_ADDED"));
            }
        }
    };

    /**
     * Comprueba si se alcanzó el límite de personas en una sala
     *
     * @returns {boolean}
     */
    function comprobarLimiteSala() {

        console.log()

        if (($scope.participantes.length + $scope.candidatos.length) == 8) {
            utils.mensajeInfo($translate.instant("LIMITE_SALA"));
            return false;
        } else {
            return true;
        }
    }


    $scope.cancelarInvitacion = function (usuario) {

        console.log("Cancelar invitación: " + usuario.username);

        $http({
            method: "POST",
            url: "api/ignorarSolicitudSala",
            data: {
                idSala: idSalaSeleccionada,
                username: usuario.username
            }
        }).then(function () {
            $scope.candidatos.forEach(function (candidato) {
                if (candidato.user.username == usuario.username) {
                    $scope.candidatos.splice($scope.candidatos.indexOf(candidato), 1);
                    utils.mensajeSuccess($translate.instant('INVITACION_ELIMINADA'));
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
            console.log(res);
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

});