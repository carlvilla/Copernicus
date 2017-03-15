process.env.NODE_ENV = 'test';

var model = require('seraph-model');
var confDB = require('../api/config/db')
var seraph = require('seraph')({
    server: confDB.db.server,
    user: confDB.db.user,
    pass: confDB.db.pass
});

var user = model(seraph, 'User');

var should = require('should');
var assert = require('assert');
var request = require('supertest');

var url = confDB.db.url;

/*
 * Test de registro de usuarios
 */
describe('Registro de usuarios', function() {
    it('debería registrar correctamente un usuario', function (done) {


        var usuario = {
            'nombre': 'Usuario',
            'apellidos': 'ApellidosUsuario',
            'username': 'nombreUsuario',
            'email': 'usuario@email.com',
            'password': 'password'
        }

        request(url)
            .post('/api/register')
            .send(usuario)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                res.status.should.be.equal(200);
                done();


                //.end(function(err, res){
                // expect(res).to.have.property('status', 200);
                //expect(res).to.be.json;


                // res.body.should.be.a('object');
                // should.exist(res.headers.date) //Comprobar que existe cookie

            })
    })
});
