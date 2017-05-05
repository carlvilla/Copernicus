var express = require('express');
var usuarioController = require('../controllers/usuarioController');
var salaController = require('../controllers/salaController');
var contactoController = require('../controllers/contactoController');

var router = express.Router();

//llamadas rest para gestionar usuarios
router.post('/login', usuarioController.login);
router.post('/register', usuarioController.register);
router.get('/profile', usuarioController.profile);
router.get('/validarUsername/:username', usuarioController.validarUsername);

//llamadas rest para gestionar salas
router.get('/salasParticipa', salaController.findSalasParticipa);
router.get('/solicitudesSala', salaController.findSalasCandidato);
router.post('/salas', salaController.checkParticipante);
router.post('/createSala', salaController.createSala);
router.post('/aceptarSolicitudSala', salaController.aceptarSolicitud);
router.post('/ignorarSolicitudSala', salaController.ignorarSolicitud);

//llamadas rest para gestionar contactos
router.get('/findPosiblesContactos', contactoController.findPosiblesContactos);
router.get('/findContacto', contactoController.findEntreContactos);
router.get('/contactos', contactoController.findMisContactos);
router.get('/solicitudesContacto', contactoController.findSolicitudesContacto);
router.post('/enviarSolicitudContacto', contactoController.enviarSolicitudContacto);
router.post('/aceptarSolicitud', contactoController.aceptarSolicitudContacto);
router.post('/ignorarSolicitud', contactoController.ignorarSolicitudContacto);


module.exports = router;