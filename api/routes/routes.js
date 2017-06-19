var express = require('express');
var usuarioController = require('../controllers/usuarioController');
var salaController = require('../controllers/salaController');
var contactoController = require('../controllers/contactoController');

var middleware = require('./middleware');
var router = express.Router();

//llamadas rest para gestionar usuarios
router.post('/login', usuarioController.login);
router.post('/register', usuarioController.register);
router.post('/datosUsuario', usuarioController.datosUsuario);
router.post('/modificarPass', usuarioController.modificarPass);
router.post('/modificarDatos', usuarioController.modificarDatos);
router.post('/eliminarCuenta', middleware.usernameExiste, usuarioController.eliminarCuenta);
router.get('/profile', usuarioController.profile);
router.get('/validarUsername/:username', usuarioController.validarUsername);

//llamadas rest para gestionar salas
router.get('/salasParticipa', salaController.findSalasParticipa);
router.get('/solicitudesSala', salaController.findSalasCandidato);
router.get('/salasAdmin', salaController.findSalasAdmin);
router.get('/salasModerador', salaController.findSalasModerador);
router.get('/salasMiembro', salaController.findSalasMiembro);
router.post('/salas', salaController.checkParticipante);
router.post('/createSala', salaController.createSala);
router.post('/aceptarSolicitudSala', middleware.usuarioNoAdminModeradorOMiembro, middleware.checkExisteSolicitudSala, salaController.aceptarSolicitud);
router.post('/ignorarSolicitudSala', middleware.checkExisteSolicitudSala, salaController.ignorarSolicitud);
router.post('/cancelarSolicitudSala', middleware.checkAdminOrModerador, middleware.checkExisteSolicitudSala, salaController.ignorarSolicitud);
router.post('/participantesSala', salaController.participantesSala);
router.post('/actualizarSala', middleware.checkAdminOrModerador, salaController.actualizarDatos);
router.post('/eliminarUsuarioSala', salaController.eliminarUsuario);
router.post('/eliminarSala', middleware.checkAdmin, salaController.eliminarSala);
router.post('/cambiarPermisos', middleware.checkAdminOrModerador, middleware.checkAdminSiCambioAModerador, salaController.cambiarPermisos);
router.post('/cambiarPermisosCandidato', middleware.checkAdminOrModerador, middleware.checkExisteSolicitudSala , salaController.cambiarPermisosCandidato);
router.post('/enviarInvitacion', middleware.usuarioNoCandidatoAdminModeradorOMiembro, middleware.comprobarLimiteSala, salaController.invitacion);
router.post('/candidatos', salaController.candidatos);

//llamadas rest para gestionar contactos
router.get('/findPosiblesContactos', contactoController.findPosiblesContactos);
router.get('/contactos', contactoController.findMisContactos);
router.get('/solicitudesContacto', contactoController.findSolicitudesContacto);
router.post('/enviarSolicitudContacto', middleware.checkNoSonContactos, contactoController.enviarSolicitudContacto);
router.post('/aceptarSolicitud', middleware.checkExisteSolicitudContacto, contactoController.aceptarSolicitudContacto);
router.post('/ignorarSolicitud', middleware.checkExisteSolicitudContacto, contactoController.ignorarSolicitudContacto);
router.post('/bloquearContacto', middleware.checkSonContactos, contactoController.bloquear);
router.post('/desbloquearContacto', middleware.checkNoSonContactos, contactoController.desbloquear);
router.get('/contactosBloqueados', contactoController.bloqueados);

module.exports = router;