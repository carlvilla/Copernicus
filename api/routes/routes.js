var express = require('express');
var usuarioController = require('../controllers/usuarioController');
var salaController = require('../controllers/salaController');
var contactoController = require('../controllers/contactoController');

var middleware = require('./middleware');
var router = express.Router();

//llamadas rest para gestionar usuarios
router.post('/login', usuarioController.login);
router.post('/register', usuarioController.register);
router.post('/bloquearContacto', usuarioController.bloquear);
router.post('/desbloquearContacto', usuarioController.desbloquear);
router.post('/modificarPass', usuarioController.modificarPass);
router.post('/modificarDatos', usuarioController.modificarDatos);
router.post('/eliminarCuenta', usuarioController.eliminarCuenta);
router.get('/profile', usuarioController.profile);
router.get('/validarUsername/:username', usuarioController.validarUsername);
router.get('/contactosBloqueados', usuarioController.bloqueados);

//llamadas rest para gestionar salas
router.get('/salasParticipa', salaController.findSalasParticipa);
router.get('/solicitudesSala', salaController.findSalasCandidato);
router.get('/salasAdmin', salaController.findSalasAdmin);
router.get('/salasModerador', salaController.findSalasModerador);
router.post('/salas', salaController.checkParticipante);
router.post('/createSala', salaController.createSala);
router.post('/aceptarSolicitudSala', salaController.aceptarSolicitud);
router.post('/ignorarSolicitudSala', salaController.ignorarSolicitud);
router.post('/participantesSala', salaController.participantesSala);
router.post('/actualizarSala', middleware.checkAdminOrModerador  ,salaController.actualizarDatos);
router.post('/eliminarUsuarioSala', salaController.eliminarUsuario);
router.post('/eliminarSala',  middleware.checkAdmin  ,salaController.eliminarSala);
router.post('/cambiarPermisos', middleware.checkAdmin, salaController.cambiarPermisos);
router.post('/cambiarPermisosCandidato', middleware.checkAdminOrModerador ,salaController.cambiarPermisosCandidato);
router.post('/enviarInvitacion', salaController.invitacion);
router.post('/candidatos', salaController.candidatos);

//llamadas rest para gestionar contactos
router.get('/findPosiblesContactos', contactoController.findPosiblesContactos);
router.get('/findContacto', contactoController.findEntreContactos);
router.get('/contactos', contactoController.findMisContactos);
router.get('/solicitudesContacto', contactoController.findSolicitudesContacto);
router.post('/enviarSolicitudContacto', contactoController.enviarSolicitudContacto);
router.post('/aceptarSolicitud', contactoController.aceptarSolicitudContacto);
router.post('/ignorarSolicitud', contactoController.ignorarSolicitudContacto);


module.exports = router;