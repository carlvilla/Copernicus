var express = require('express');
var usuarioController = require('../controllers/usuarioController');
var salaController = require('../controllers/salaController');
var contactoController = require('../controllers/contactoController');

var middleware = require('./middleware');
var router = express.Router();

//llamadas rest para gestionar usuarios
router.post('/login', usuarioController.login);
router.post('/registrar', middleware.checkEmail, middleware.usernameNoExiste ,usuarioController.registrar);
router.post('/datosUsuario', usuarioController.datosUsuario);
router.post('/modificarPass', usuarioController.modificarPass);
router.post('/modificarDatos', middleware.checkEmail, middleware.checkNombreApellidos ,usuarioController.modificarDatos);
router.post('/eliminarCuenta', middleware.usernameExiste, usuarioController.eliminarCuenta);
router.get('/perfil', usuarioController.perfil);
router.get('/validarUsername/:username', usuarioController.validarUsername);

//llamadas rest para gestionar salas
router.get('/salasParticipa', salaController.buscarSalasParticipa);
router.get('/solicitudesSala', salaController.buscarSalasCandidato);
router.get('/salasAdmin', salaController.buscarSalasAdmin);
router.get('/salasModerador', salaController.buscarSalasModerador);
router.get('/salasMiembro', salaController.buscarSalasMiembro);
router.post('/salas', salaController.checkParticipante);
router.post('/crearSala', middleware.checkLimiteSala, middleware.checkNombreDescripcionSala , salaController.crearSala);
router.post('/aceptarSolicitudSala', middleware.usuarioNoAdminModeradorOMiembro, middleware.checkExisteSolicitudSala, salaController.aceptarSolicitudSala);
router.post('/ignorarSolicitudSala', middleware.checkExisteSolicitudSala, salaController.ignorarSolicitudSala);
router.post('/eliminarSolicitudSala', middleware.checkAdminOrModerador, middleware.checkExisteSolicitudSala, salaController.ignorarSolicitudSala);
router.post('/participantesSala', salaController.buscarParticipantesSala);
router.post('/actualizarSala', middleware.checkAdminOrModerador, salaController.actualizarDatos);
router.post('/eliminarUsuarioSala', middleware.checkPosibleEliminar ,salaController.eliminarUsuario);
router.post('/eliminarSala', middleware.checkAdmin, salaController.eliminarSala);
router.post('/cambiarPermisos', middleware.checkAdminOrModerador, middleware.checkAdminSiCambioAModerador, salaController.cambiarPermisos);
router.post('/cambiarPermisosSolicitud', middleware.checkAdminOrModerador, middleware.checkExisteSolicitudSala , salaController.cambiarPermisosSolicitud);
router.post('/enviarSolicitudSala', middleware.usuarioNoCandidatoAdminModeradorOMiembro, middleware.checkLimiteSala, salaController.enviarSolicitudSala);
router.post('/candidatos', salaController.buscarCandidatos);

//llamadas rest para gestionar contactos
router.get('/posiblesContactos', contactoController.buscarPosiblesContactos);
router.get('/contactos', contactoController.buscarContactos);
router.get('/solicitudesContacto', contactoController.buscarSolicitudesContacto);
router.post('/enviarSolicitudContacto', middleware.checkNoSonContactos, contactoController.enviarSolicitudContacto);
router.post('/aceptarSolicitud', middleware.checkExisteSolicitudContacto, contactoController.aceptarSolicitudContacto);
router.post('/ignorarSolicitud', middleware.checkExisteSolicitudContacto, contactoController.ignorarSolicitudContacto);
router.post('/bloquearContacto', middleware.checkSonContactos, contactoController.bloquear);
router.post('/desbloquearContacto', middleware.checkNoSonContactos, contactoController.desbloquear);
router.get('/contactosBloqueados', contactoController.buscarBloqueados);

module.exports = router;