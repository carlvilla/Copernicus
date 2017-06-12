require('dotenv').load();
process.env.NODE_ENV = 'test';

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

        it('El nombre de usuario no debería estar cogido', function (done) {
            var username = 'nombreUsuario';

            request(url)
                .get('/api/validarUsername:'+username)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(204);

                    done();

                });
        }),

        it('Debería registrar correctamente un usuario', function (done) {

            var usuario = {
                'nombre': 'Usuario',
                'apellidos': 'ApellidosUsuario',
                'username': 'nombreUsuario',
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

                    res.status.should.be.equal(200);

                    should.exist(res.body.token);//Comprobar que existe cookie de sesión

                    done();

                });
        }),

        it('No debería registrar correctamente con estos datos', function (done) {

            var usuario = {
                'nombre': 'Usuario',
                'apellidos': 'ApellidosUsuario',
                'username': 'nombreUsuario',
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

                    res.status.should.be.equal(200);

                    should.exist(res.body.token);//Comprobar que existe cookie de sesión

                    done();

                });
        })


    });

    describe('Login de usuarios', function () {
        it('Deberiamos logearnos con estos credenciales', function (done) {

            var credenciales = {
                'username': 'nombreUsuario',
                'password': 'passwordtest'
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
                'username': 'nombreUsuario',
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


});

