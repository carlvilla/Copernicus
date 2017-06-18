require('dotenv').load();

var model = require('seraph-model');
var confDB = require('../api/config/db');
var db = require('seraph')({
    server: confDB.db.server,
    user: confDB.db.user,
    pass: confDB.db.pass
});

var should = require('should');
var assert = require('assert');
var request = require('supertest');

var url = 'http://localhost:8080';

var deleteDBQuery = "MATCH (n) DETACH DELETE n";

var tokenUsuario1;
var tokenUsuario2;
var tokenUsuario3;
var tokenUsuario4;
var tokenUsuario5;

describe('Pruebas unitarias', function () {

    //Preparamos la base de datos antes de realizar los tests
    before(function () {
        db.query(deleteDBQuery, function (err, result) {
            if (err) throw err;
        });
    });

    /*
     * Test de registro de usuarios
     *
     * En este test comprobamos que se añade un usuario correctamente y que recibimos una cookie llamada 'token'
     * que es utilizada para mantener la sesión del usuario
     *
     */
    describe('Registro de usuarios', function () {

        it("El nombre de usuario 'nombreUsuario' debería estar disponible'", function (done) {
            var username = 'nombreUsuario';

            request(url)
                .get('/api/validarUsername/' + username)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(204);
                    done();

                });
        })

        it('Debería registrar correctamente a usuario1', function (done) {

            var usuario = {
                'nombre': 'Usuario1',
                'apellidos': 'ApellidosUsuario1',
                'username': 'usuario1',
                'email': 'usuario1@email.com',
                'password': 'usuario1'
            }

            request(url)
                .post('/api/register')
                .send(usuario)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);

                    should.exist(res.body.token);//Comprobar que existe cookie de sesión
                    tokenUsuario1 = res.body.token;

                    done();

                });
        })

        it('Debería registrar correctamente a usuario2', function (done) {

            var usuario = {
                'nombre': 'Usuario2',
                'apellidos': 'ApellidosUsuario2',
                'username': 'usuario2',
                'email': 'usuario2@email.com',
                'password': 'usuario2'
            }

            request(url)
                .post('/api/register')
                .send(usuario)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);

                    should.exist(res.body.token);//Comprobar que existe cookie de sesión

                    tokenUsuario2 = res.body.token;

                    done();

                });
        })

        it('Debería registrar correctamente a usuario3', function (done) {

            var usuario = {
                'nombre': 'Usuario3',
                'apellidos': 'ApellidosUsuario3',
                'username': 'usuario3',
                'email': 'usuario3@email.com',
                'password': 'usuario3'
            }

            request(url)
                .post('/api/register')
                .send(usuario)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);

                    should.exist(res.body.token);//Comprobar que existe cookie de sesión

                    tokenUsuario3 = res.body.token;

                    done();

                });
        })

        it('Debería registrar correctamente a usuario4', function (done) {

            var usuario = {
                'nombre': 'Usuario4',
                'apellidos': 'ApellidosUsuario4',
                'username': 'usuario4',
                'email': 'usuario4@email.com',
                'password': 'usuario4'
            }

            request(url)
                .post('/api/register')
                .send(usuario)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);

                    should.exist(res.body.token);//Comprobar que existe cookie de sesión

                    tokenUsuario4 = res.body.token;

                    done();

                });
        })

        it('Debería registrar correctamente a usuario5', function (done) {

            var usuario = {
                'nombre': 'Usuario5',
                'apellidos': 'ApellidosUsuario5',
                'username': 'usuario5',
                'email': 'usuario5@email.com',
                'password': 'usuario5'
            }

            request(url)
                .post('/api/register')
                .send(usuario)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);

                    should.exist(res.body.token);//Comprobar que existe cookie de sesión

                    tokenUsuario5 = res.body.token;

                    done();

                });
        })

        it("El nombre de usuario 'usuario1' no debería de estar disponible", function (done) {
            var username = 'usuario1';

            request(url)
                .get('/api/validarUsername/' + username)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);

                    done();

                });
        })

        it("No debería registrar al usuario con estos datos ya que el nombre de usuario está en uso", function (done) {

            var usuario = {
                'nombre': 'Usuario',
                'apellidos': 'ApellidosUsuario',
                'username': 'usuario1',
                'email': 'usuario@email.com',
                'password': 'passwordtest'
            }

            request(url)
                .post('/api/register')
                .send(usuario)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(403);

                    done();

                });
        })


    });

    describe('Login de usuarios', function () {
        it('Usuario1 deberia iniciar sesión con estos credenciales', function (done) {

            var credenciales = {
                'username': 'usuario1',
                'password': 'usuario1'
            }

            request(url)
                .post('/api/login')
                .send(credenciales)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    should.exist(res.body.token);

                    done();

                })
        })

        it('Usuario1 no debería iniciar sesión con estos credenciales', function (done) {

            var credenciales = {
                'username': 'usuario1',
                'password': 'passwordErronea'
            }

            request(url)
                .post('/api/login')
                .send(credenciales)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(401);
                    should.not.exists(res.body.token);
                    done();

                })
        })

    });

    describe('Añadir contactos', function () {
        it('Usuario1 deberia mandar una solicitud de contacto al usuario2', function (done) {
            request(url)
                .post('/api/enviarSolicitudContacto')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({'username': 'usuario2', 'mensaje': '¡Agrégame!'})
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(204);
                    done();

                })
        })

        it('Usuario1 deberia mandar una solicitud de contacto al usuario3', function (done) {
            request(url)
                .post('/api/enviarSolicitudContacto')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({'username': 'usuario3', 'mensaje': '¡Agrégame!'})
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(204);
                    done();

                })
        })


        it('Usuario1 deberia mandar una solicitud de contacto al usuario4', function (done) {
            request(url)
                .post('/api/enviarSolicitudContacto')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({'username': 'usuario4', 'mensaje': '¡Hola!'})
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(204);
                    done();

                })
        })

        it('Usuario2 deberia mandar una solicitud de contacto al usuario4', function (done) {
            request(url)
                .post('/api/enviarSolicitudContacto')
                .set('Cookie', ['token = ' + tokenUsuario2])
                .send({'username': 'usuario4'})
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(204);
                    done();

                })
        })

        it('Usuario5 deberia mandar una solicitud de contacto al usuario1', function (done) {
            request(url)
                .post('/api/enviarSolicitudContacto')
                .set('Cookie', ['token = ' + tokenUsuario5])
                .send({'username': 'usuario1', 'mensaje': '¡Hola!'})
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(204);
                    done();
                })
        })
    });

    describe('Aceptar solicitudes de contactos', function () {

        it('El usuario2 deberia tener 1 solicitud de contacto del usuario1', function (done) {
            request(url)
                .get('/api/solicitudesContacto')
                .set('Cookie', ['token = ' + tokenUsuario2])
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 1);
                    done();
                })
        })

        it('El usuario2 deberia aceptar la solicitud de contacto del usuario1', function (done) {
            request(url)
                .post('/api/aceptarSolicitud')
                .set('Cookie', ['token = ' + tokenUsuario2])
                .send({'usernameAceptado': 'usuario1'})
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(204);
                    done();
                })
        })

        it('El usuario2 no deberia tener solicitudes de contacto', function (done) {
            request(url)
                .get('/api/solicitudesContacto')
                .set('Cookie', ['token = ' + tokenUsuario2])
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(204);
                    done();
                })
        })

        it('El usuario4 deberia tener 2 solicitudes de contacto, una del usuario1 y otra del usuario2', function (done) {
            request(url)
                .get('/api/solicitudesContacto')
                .set('Cookie', ['token = ' + tokenUsuario4])
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 2);
                    done();
                })
        })

        it('El usuario4 deberia ignorar la solicitud de contacto del usuario1', function (done) {
            request(url)
                .post('/api/ignorarSolicitud')
                .set('Cookie', ['token = ' + tokenUsuario4])
                .send({'usernameIgnorado': 'usuario1'})
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(204);
                    done();

                })
        })

        it('El usuario4 deberia tener 1 solicitud de contacto', function (done) {
            request(url)
                .get('/api/solicitudesContacto')
                .set('Cookie', ['token = ' + tokenUsuario4])
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 1);
                    done();
                })
        })


        it('El usuario3 deberia aceptar la solicitud de contacto del usuario1', function (done) {
            request(url)
                .post('/api/aceptarSolicitud')
                .set('Cookie', ['token = ' + tokenUsuario3])
                .send({'usernameAceptado': 'usuario1'})
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(204);
                    done();
                })
        })


    });


    describe('Bloquear y desbloquear contactos', function () {
        it('Usuario1 deberia bloquear al usuario2', function (done) {
            request(url)
                .post('/api/bloquearContacto')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({'username': 'usuario2'})
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(204);
                    done();

                })
        })

        it('Deberia devolver un usuario bloqueado para usuario1', function (done) {
            request(url)
                .get('/api/contactosBloqueados')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 1);
                    done();

                })
        })

        it('Deberia desbloquear al usuario2', function (done) {
            request(url)
                .post('/api/desbloquearContacto')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({'username': 'usuario2'})
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(204);
                    done();

                })
        })

        it('Deberia devolver 0 usuarios bloqueados para usuario1', function (done) {
            request(url)
                .get('/api/contactosBloqueados')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 0)
                    done();

                })
        })


    });

    describe('Crear sala', function () {

        it("Deberia crear una sala llamada 'Sala de pruebas' cuyo administrador es el usuario2 y se le envía una solicitud de unión como moderador" +
            " al usuario1", function (done) {
            request(url)
                .post('/api/createSala')
                .set('Cookie', ['token = ' + tokenUsuario2])
                .send({
                    'sala': {
                        nombre: 'Sala de pruebas',
                        descripcion: 'Esta es la descripción de la sala de pruebas',
                        idSala: 1,
                        fotoPorDefecto: true
                    },
                    'usuarios': [{'username': 'usuario1', 'permisos': 'Moderador'}]

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })

        it("Deberia crear una sala llamada 'Sala de pruebas 2' cuyo administrador es el usuario2 y se le envía una solicitud de unión como miembro" +
            " al usuario1", function (done) {
            request(url)
                .post('/api/createSala')
                .set('Cookie', ['token = ' + tokenUsuario2])
                .send({
                    'sala': {
                        nombre: 'Sala de pruebas 2',
                        descripcion: 'Sala para realizar pruebas',
                        idSala: 2,
                        fotoPorDefecto: true
                    },
                    'usuarios': [{'username': 'usuario1', 'permisos': 'Miembro'}]

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })

        it("Deberia crear una sala llamada 'Sala de pruebas 3' cuyo administrador es el usuario1 y se envía " +
            "solicitudes de unión como moderador al usuario2 y como miembro al usuario3", function (done) {
            request(url)
                .post('/api/createSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    'sala': {
                        nombre: 'Sala de pruebas 3',
                        descripcion: 'Sala creada mediantes pruebas automatizadas',
                        idSala: 3,
                        fotoPorDefecto: true
                    },
                    'usuarios': [
                        {'username': 'usuario2', 'permisos': 'Moderador'},
                        {'username': 'usuario3', 'permisos': 'Miembro'}
                    ]

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })

        it("Deberia crear una sala llamada 'Sala de pruebas 4' cuyo administrador es el usuario1 y envia solicitud " +
            "de unión como moderador a usuario3", function (done) {
            request(url)
                .post('/api/createSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    'sala': {
                        nombre: 'Sala de pruebas 4',
                        descripcion: 'Sala creada mediantes pruebas automatizadas',
                        idSala: 4,
                        fotoPorDefecto: true,
                        usuarios: [{'username': 'usuario3', 'permisos': 'Moderador'}]
                    }

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })


    });

    describe('Enviar solicitudes de unión a salas', function () {
        it("El usuario2 deberia enviar una solicitud de unión a la sala 'Sala de pruebas' como miembro al usuario 4", function (done) {
            request(url)
                .post('/api/enviarInvitacion')
                .set('Cookie', ['token = ' + tokenUsuario2])
                .send({
                    idSala: 1,
                    username: 'usuario4'

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })

        it("El usuario2 no deberia volver a enviar una solicitud de unión para la sala 'Sala de pruebas' al usuario4", function (done) {
            request(url)
                .post('/api/enviarInvitacion')
                .set('Cookie', ['token = ' + tokenUsuario2])
                .send({
                    idSala: 1,
                    username: 'usuario4'

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(400);
                done();

            })
        })
    });


    describe('Aceptar solicitudes salas', function () {

        it("El usuario1 debería haber recibido 2 solicitudes de unión a salas", function (done) {
            request(url)
                .get('/api/solicitudesSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 2);
                    done();

                })
        })

        it("El usuario1 deberia aceptar la solicitud de unión a la sala 'Sala de pruebas'", function (done) {
            request(url)
                .post('/api/aceptarSolicitudSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    idSala: 1

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(200);
                done();

            })
        })

        it("El usuario1 no deberia poder aceptar la solicitud de unión a la 'Sala de pruebas' porque ya pertenece a ella", function (done) {
            request(url)
                .post('/api/aceptarSolicitudSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    idSala: 1

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(400);
                done();

            })
        })

        it("El usuario1 debería tener 1 solicitud de unión a salas", function (done) {
            request(url)
                .get('/api/solicitudesSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 1);
                    done();

                })
        })


    });


    describe('Ignorar solicitudes salas', function () {

        it("El usuario4 debería tener 1 solicitud de unión a salas", function (done) {
            request(url)
                .get('/api/solicitudesSala')
                .set('Cookie', ['token = ' + tokenUsuario4])
                .end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 1);
                    done();

                })
        })


        it("El usuario4 deberia ignorar la solicitud de unión a la sala 'Sala de pruebas'", function (done) {
            request(url)
                .post('/api/ignorarSolicitudSala')
                .set('Cookie', ['token = ' + tokenUsuario4])
                .send({
                    idSala: 1

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })

        it("El usuario4 no deberia poder ignorar la solicitud de unión a la 'Sala de pruebas' porque ya lo hizo", function (done) {
            request(url)
                .post('/api/ignorarSolicitudSala')
                .set('Cookie', ['token = ' + tokenUsuario4])
                .send({
                    idSala: 1

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(400);
                done();

            })
        })

        it("El usuario4 no debería tener ninguna solicitud de unión a salas", function (done) {
            request(url)
                .get('/api/solicitudesSala')
                .set('Cookie', ['token = ' + tokenUsuario4])
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 0);
                    done();
                })
        })
    });

    describe('Comprobar salas participan usuarios', function () {

        it("El usuario1 debería participar en 3 salas", function (done) {
            request(url)
                .get('/api/salasAdmin')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 2);
                    done();

                })
        })


        it("El usuario1 debería ser administrador en 2 salas", function (done) {
            request(url)
                .get('/api/salasAdmin')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 2);
                    done();

                })
        })

        it("El usuario1 debería ser moderador en 1 sala", function (done) {
            request(url)
                .get('/api/salasModerador')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 1);
                    done();

                })
        })

        it("El usuario1 debería ser miembro en 0 salas", function (done) {
            request(url)
                .get('/api/salasMiembro')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 0);
                    done();

                })
        })

    });

    describe('Gestion salas', function () {

        it("El usuario1 al ser moderador de la sala 'Sala de prueba' debería cambiar el nombre de la sala a " +
            "'Partidos del domingo' y la descripción a 'En esta sala se organizan los partidos del domingo'"
            , function (done) {
                request(url)
                    .post('/api/actualizarSala')
                    .set('Cookie', ['token = ' + tokenUsuario1])
                    .send({
                        idSala: 1,
                        nombre: 'Partidos del domingo',
                        descripcion: 'En esta sala se organizan los partidos del domingo',
                        fotoCambiada: false
                    }).end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(204);
                    done();

                })
            })

        it("El usuario1 al ser moderador de la sala 'Partidos del domingo' debería enviar una solicitud de unión como miembro" +
            " al usuario3", function (done) {
            request(url)
                .post('/api/enviarInvitacion')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    idSala: 1,
                    username: 'usuario3'

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })

        it("El usuario3 debería aceptar la solicitud de unión a la sala 'Partidos del domingo'", function (done) {
            request(url)
                .post('/api/aceptarSolicitudSala')
                .set('Cookie', ['token = ' + tokenUsuario3])
                .send({
                    idSala: 1,
                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(200);
                done();

            })
        })

        it("El usuario1 no deberia cancelar la solicitud de unión a la sala de usuario 3 porque este último ya la " +
            "aceptó", function (done) {
            request(url)
                .post('/api/cancelarSolicitudSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    idSala: 1,
                    username: 'usuario3'

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(400);
                done();

            })
        })



        it("El usuario3 al ser miembro de la sala 'Partidos del domingo' no debería cambiar el nombre ni la descripción" +
            " de la sala", function (done) {
            request(url)
                .post('/api/actualizarSala')
                .set('Cookie', ['token = ' + tokenUsuario3])
                .send({
                    idSala: 1,
                    nombre: 'Nuevo nombre de la sala',
                    descripcion: 'Descripción de la sala',
                    fotoCambiada: false
                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(400);
                done();

            })
        })


        it("El usuario1 al ser moderador de la sala 'Sala de prueba' deberia cambiar los permisos a moderador del " +
            "usuario 3", function (done) {
            request(url)
                .post('/api/cambiarPermisos')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    idSala: 1,
                    username: 'usuario3',
                    permisos: 'Moderador'

                }).end(function (err, res) {
                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })

        it("El usuario1 al no ser administrador de la sala 'Sala de prueba' no deberia cambiar los permisos al usuario3 " +
            "ya que este es moderador", function (done) {
            request(url)
                .post('/api/cambiarPermisos')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    idSala: 1,
                    username: 'usuario3',
                    permisos: 'Miembro'

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(400);
                done();

            })
        })

        it("El usuario2 al ser administrador de la sala 'Sala de prueba' deberia cambiar los permisos al usuario3 " +
            "a miembro", function (done) {
            request(url)
                .post('/api/cambiarPermisos')
                .set('Cookie', ['token = ' + tokenUsuario2])
                .send({
                    idSala: 1,
                    username: 'usuario3',
                    permisos: 'Miembro'

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })

        it("El usuario1 al ser moderador de la sala 'Sala de prueba' deberia eliminar al usuario3 " +
            "de la sala", function (done) {
            request(url)
                .post('/api/eliminarUsuarioSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    idSala: 1,
                    username: 'usuario3'

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })

        it("El usuario2 al ser administrador de la sala 'Sala de prueba' deberia mandar una solicitud de unión a la sala" +
            " como miembro al usuario3 ", function (done) {
            request(url)
                .post('/api/enviarInvitacion')
                .set('Cookie', ['token = ' + tokenUsuario2])
                .send({
                    idSala: 1,
                    username: 'usuario3'

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })

        it("El usuario1 al ser moderador de la sala 'Sala de prueba' deberia cancelar la solicitud de unión a la sala" +
            " del usuario3 ", function (done) {
            request(url)
                .post('/api/cancelarSolicitudSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    idSala: 1,
                    username: 'usuario3'

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })


        it("El usuario1 al ser administrador de la sala 'Sala de prueba 4' deberia eliminar la sala ", function (done) {
            request(url)
                .post('/api/eliminarSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    idSala: 4,
                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })

        it("El usuario3 no debería ser moderador en ninguna sala ya que se eliminó la sala 'Sala de pruebas 4'", function (done) {
            request(url)
                .get('/api/salasModerador')
                .set('Cookie', ['token = ' + tokenUsuario3])
                .end(function (err, res) {

                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    assert.equal(res.body.length, 0);
                    done();

                })
        })


    });

    describe('Ajustes de la cuenta', function () {

        it("El usuario1 debería cambiar su nombre a 'Jose', sus apellidos a 'Ejemplos de apellidos' y su email " +
            "a 'jose@gmail.com'", function (done) {
            request(url)
                .post('/api/modificarDatos')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    nombre: 'Jose',
                    apellidos: 'Ejemplos de apellidos',
                    email: 'jose@gmail.com',
                    fotoCambiada: false
                })
                .end(function (err, res) {

                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(204);
                    done();
                })
        })

        it("El usuario1 no debería cambiar su email ya que el formato es incorrecto", function (done) {
            request(url)
                .post('/api/modificarDatos')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    nombre: 'Jose',
                    apellidos: 'Ejemplos de apellidos',
                    email: 'emailNoValido',
                    fotoCambiada: false
                })
                .end(function (err, res) {

                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    done();
                })
        })

        it("El usuario4 deberia cambiar su contraseña a 'passCambiada'", function (done) {
            request(url)
                .post('/api/modificarPass')
                .set('Cookie', ['token = ' + tokenUsuario4])
                .send({
                    'username': 'usuario4',
                    'password': 'usuario4',
                    'passwordNueva': 'passCambiada'
                })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(204);
                    done();

                })
        })

        it('El usuario1 no deberia cambiar la contraseña ya que la actual proporcionada es incorrecta ', function (done) {
            request(url)
                .post('/api/modificarPass')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    'username': 'usuario1',
                    'password': 'passwordIncorrecta',
                    'passwordNueva': 'nuevaPassword'
                })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(401);
                    done();

                })
        })

        it("El usuario4 deberia eliminar su cuenta", function (done) {
            request(url)
                .post('/api/eliminarCuenta')
                .set('Cookie', ['token = ' + tokenUsuario4])

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(204);
                    done();

                })
        })

        it("No se debería eliminar ninguna cuenta ya que no hay usuarios con nombre de usuario 'usuario4'", function (done) {
            request(url)
                .post('/api/eliminarCuenta')
                .set('Cookie', ['token = ' + tokenUsuario4])

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    done();

                })
        })


    });
});

