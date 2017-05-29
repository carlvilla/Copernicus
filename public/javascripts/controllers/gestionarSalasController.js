var webApp = angular.module('webApp');

webApp.controller('gestionarSalasController', function ($scope, $http, growl, $translate) {

        var idSalaSeleccionada;

        function error(res) {
            mostrarMensajeError($translate.instant('OPERACION_NO_AUTORIZADA'));
        }

        $http({
            method: "GET",
            url: "api/salasAdmin"
        }).then(function (res) {
            $scope.salasAdmin = res.data;
        }, error)

        $http({
            method: "GET",
            url: "api/salasModerador"
        }).then(function (res) {
            $scope.salasModerador = res.data;
        }, error)

        $scope.mostrarInfoSala = function (idSala, admin) {
            idSalaSeleccionada = idSala;
            if (admin) {
                ($scope.salasAdmin).forEach(function (sala) {
                    if (sala.idSala == idSala) {
                        $scope.salaSeleccionada = sala;
                    }
                })

            } else {
                $scope.salasModerador.every(function (sala) {
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
                    console.log($scope.candidatos);
                }, error);
            }, error)
        };

        var mostrarMensaje = function (res) {
            growl.success(res, {ttl: 4000});
        }

        var mostrarMensajeError = function (res) {
            growl.error(res, {ttl: 4000});
        }


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
                        mostrarMensaje($translate.instant('USUARIO_ELIMINADO'));
                    }
                })
            });
        }

        $scope.actualizarSala = function () {
            $http({
                method: "POST",
                url: "api/actualizarSala",
                data: {
                    idSala: idSalaSeleccionada,
                    nombre: $scope.salaSeleccionada.nombre,
                    descripcion: $scope.salaSeleccionada.descripcion
                }
            }).then(
                function () {
                    mostrarMensaje($translate.instant('DATOS_SALA_ACTUALIZADOS'))
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
                        mostrarMensaje($translate.instant("SALA_ELIMINADA"));
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
                mostrarMensaje($translate.instant("PERMISOS_USUARIO_CAMBIADOS"));
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
                mostrarMensaje($translate.instant("PERMISOS_USUARIO_CAMBIADOS"));
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
            if ($scope.usuarioSeleccionado != undefined) {
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

                    mostrarMensaje($translate.instant("INVITACION_ENVIADA"));


                } else {
                    mostrarMensaje($translate.instant("USUARIO_ALREADY_ADDED"));
                }
            }
        };

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
                        mostrarMensaje($translate.instant('INVITACION_ELIMINADA'));
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
    }
);