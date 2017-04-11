var express = require('express');
var usuarioController = require('../controllers/usuarioController');
var salaController = require('../controllers/salaController');
var router = express.Router();

//llamadas rest para gestionar usuarios
router.post('/login', usuarioController.login);
router.post('/register', usuarioController.register);
router.get('/profile', usuarioController.profile);
router.get('/validarUsername/:username', usuarioController.validarUsername);

//llamadas rest para gestionar salas
router.get('/salasParticipa', salaController.findSalasParticipa);
router.post('/chatroom', salaController.checkParticipante);


module.exports = router;
