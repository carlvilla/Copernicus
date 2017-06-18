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

describe('Tests de usuarios', function () {

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

        it('El nombre de usuario debería estar disponible', function (done) {
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
        }),

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
            }),

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
            }),

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
            }),


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
            }),

            it('El nombre de usuario no debería de estar disponible', function (done) {
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
            }),

            it('No debería registrar correctamente con estos datos ya que el nombre de usuario está en uso', function (done) {

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
        it('Usuario1 deberia logearse con estos credenciales', function (done) {

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
        }),

            it('No deberiamos logearnos con estos credenciales', function (done) {

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

    describe('Bloquear y desbloquear usuarios', function () {
        it('Deberia bloquear al usuario2', function (done) {
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
                    assert.equal(res.body.length, 1)
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
                    console.log(res.body.length);
                    assert.equal(res.body.length, 0)
                    done();

                })
        })


    });

    describe('Cambiar contraseña', function () {
        it('Deberia cambiar la contraseña al usuario4', function (done) {
            request(url)
                .post('/api/modificarPass')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    'username': 'usuario4',
                    'password': 'usuario4',
                    'passwordNueva': 'passCambiada4'
                })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(204);
                    done();

                })
        })

        it('No deberia cambiar la contraseña al usuario1', function (done) {
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
    });


    describe('Crear sala', function () {
        it("Deberia crear una sala llamada 'Sala de pruebas' cuyo administrador es el usuario1 y se le envía una solicitud de unión como moderador" +
            " al usuario2 y como miembro al usuario3", function (done) {
            request(url)
                .post('/api/createSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    'sala': {
                        nombre: 'Sala de pruebas',
                        descripcion: 'Sala creada mediantes pruebas automatizadas',
                        idSala: 1,
                        fotoPorDefecto: true
                    },
                    'usuarios': [{'username': 'usuario2', 'permisos': 'Moderador'},
                        {'username': 'usuario2', 'permisos': 'Miembro'}]

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })


        it("Deberia crear una sala llamada 'Sala de pruebas 2' cuyo administrador es el usuario2 y se le envía una solicitud de unión como moderador" +
            " al usuario1", function (done) {
            request(url)
                .post('/api/createSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    'sala': {
                        nombre: 'Sala de pruebas 2',
                        descripcion: 'Esta es la descripción de la sala de pruebas 3',
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

        it("Deberia crear una sala llamada 'Sala de pruebas 3' cuyo administrador es el usuario2 y se le envía una solicitud de unión como miembro" +
            " al usuario1", function (done) {
            request(url)
                .post('/api/createSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    'sala': {
                        nombre: 'Sala de pruebas 3',
                        descripcion: 'Sala para realizar pruebas',
                        idSala: 1,
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
    });

    describe('Aceptar solicitudes de unión a salas', function () {
        it('El usuario1 deberia aceptar la solicitud de unión a la sala una sala cuyo administrador es el usuario1 y se le envía una solicitud de unión como moderador' +
            ' al usuario2 y como miembro al usuario3', function (done) {
            request(url)
                .post('/api/createSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    'sala': {
                        nombre: 'Sala de pruebas',
                        descripcion: 'Sala creada mediantes pruebas automatizadas',
                        idSala: 1,
                        fotoPorDefecto: true
                    },
                    'usuarios': [{'username': 'usuario2', 'permisos': 'Moderador'},
                        {'username': 'usuario2', 'permisos': 'Miembro'}]

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })


        it('Deberia crear una sala cuyo administrador es el usuario2 y se le envía una solicitud de unión como moderador' +
            ' al usuario1', function (done) {
            request(url)
                .post('/api/createSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    'sala': {
                        nombre: 'Sala de pruebas',
                        descripcion: 'Sala creada mediantes pruebas automatizadas',
                        idSala: 1,
                        fotoPorDefecto: true
                    },
                    'usuarios': [{'username': 'usuario2', 'permisos': 'Moderador'}]

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })

        it('Deberia crear una sala cuyo administrador es el usuario2 y se le envía una solicitud de unión como miembro' +
            ' al usuario1', function (done) {
            request(url)
                .post('/api/createSala')
                .set('Cookie', ['token = ' + tokenUsuario1])
                .send({
                    'sala': {
                        nombre: 'Sala de pruebas',
                        descripcion: 'Sala creada mediantes pruebas automatizadas',
                        idSala: 1,
                        fotoPorDefecto: true
                    },
                    'usuarios': [{'username': 'usuario2', 'permisos': 'Moderador'}]

                }).end(function (err, res) {

                if (err) {
                    throw err;
                }

                res.status.should.be.equal(204);
                done();

            })
        })
    });





});

