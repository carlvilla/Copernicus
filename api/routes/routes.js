var express = require('express');
var usuarioController = require('../controllers/usuarioController');
var salaController = require('../controllers/salaController');
var contactoController = require('../controllers/contactoController');

var middleware = require('./middleware');
var router = express.Router();

//llamadas rest para gestionar usuarios
router.post('/login', middleware.checkDatabase, usuarioController.login);
router.post('/register', middleware.checkDatabase, usuarioController.register);
router.post('/bloquearContacto', middleware.checkDatabase, middleware.checkSonContactos, usuarioController.bloquear);
router.post('/desbloquearContacto', middleware.checkDatabase, middleware.checkNoSonContactos, usuarioController.desbloquear);
router.post('/datosUsuario', middleware.checkDatabase, usuarioController.datosUsuario);
router.post('/modificarPass', middleware.checkDatabase, usuarioController.modificarPass);
router.post('/modificarDatos', middleware.checkDatabase, usuarioController.modificarDatos);
router.post('/eliminarCuenta', middleware.checkDatabase, middleware.usernameExiste, usuarioController.eliminarCuenta);
router.get('/profile', middleware.checkDatabase, usuarioController.profile);
router.get('/validarUsername/:username', middleware.checkDatabase, usuarioController.validarUsername);
router.get('/contactosBloqueados', middleware.checkDatabase, usuarioController.bloqueados);

//llamadas rest para gestionar salas
router.get('/salasParticipa', middleware.checkDatabase, salaController.findSalasParticipa);
router.get('/solicitudesSala', middleware.checkDatabase, salaController.findSalasCandidato);
router.get('/salasAdmin', middleware.checkDatabase, salaController.findSalasAdmin);
router.get('/salasModerador', middleware.checkDatabase, salaController.findSalasModerador);
router.get('/salasMiembro', middleware.checkDatabase, salaController.findSalasMiembro);
router.post('/salas', middleware.checkDatabase, salaController.checkParticipante);
router.post('/createSala', middleware.checkDatabase, salaController.createSala);
router.post('/aceptarSolicitudSala', middleware.checkDatabase, middleware.usuarioNoAdminModeradorOMiembro, middleware.checkExisteSolicitudSala, salaController.aceptarSolicitud);
router.post('/ignorarSolicitudSala', middleware.checkDatabase, middleware.checkExisteSolicitudSala, salaController.ignorarSolicitud);
router.post('/cancelarSolicitudSala', middleware.checkDatabase, middleware.checkAdminOrModerador, middleware.checkExisteSolicitudSala, salaController.ignorarSolicitud);
router.post('/participantesSala', middleware.checkDatabase, salaController.participantesSala);
router.post('/actualizarSala', middleware.checkDatabase, middleware.checkAdminOrModerador, salaController.actualizarDatos);
router.post('/eliminarUsuarioSala', middleware.checkDatabase, salaController.eliminarUsuario);
router.post('/eliminarSala', middleware.checkDatabase, middleware.checkAdmin, salaController.eliminarSala);
router.post('/cambiarPermisos', middleware.checkDatabase, middleware.checkAdminOrModerador, middleware.checkAdminSiCambioAModerador, salaController.cambiarPermisos);
router.post('/cambiarPermisosCandidato', middleware.checkDatabase, middleware.checkAdminOrModerador, salaController.cambiarPermisosCandidato);
router.post('/enviarInvitacion', middleware.checkDatabase, middleware.usuarioNoCandidatoAdminModeradorOMiembro, middleware.comprobarLimiteSala, salaController.invitacion);
router.post('/candidatos', middleware.checkDatabase, salaController.candidatos);

//llamadas rest para gestionar contactos
router.get('/findPosiblesContactos', middleware.checkDatabase, contactoController.findPosiblesContactos);
router.get('/contactos', middleware.checkDatabase, contactoController.findMisContactos);
router.get('/solicitudesContacto', middleware.checkDatabase, contactoController.findSolicitudesContacto);
router.post('/enviarSolicitudContacto', middleware.checkDatabase, middleware.checkNoSonContactos, contactoController.enviarSolicitudContacto);
router.post('/aceptarSolicitud', middleware.checkDatabase, middleware.checkExisteSolicitudContacto, contactoController.aceptarSolicitudContacto);
router.post('/ignorarSolicitud', middleware.checkDatabase, middleware.checkExisteSolicitudContacto, contactoController.ignorarSolicitudContacto);


module.exports = router;