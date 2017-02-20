var express = require('express');
var router = express.Router();
var ctrl = require('../controllers/controllers');

router.get('/', ctrl.index);
router.get('/about', ctrl.about);
router.get('/index', ctrl.index);
router.get('/profile', ctrl.profile); //Página en la que el usuario puede cambiar sus datos personales
router.get('/register', ctrl.register);
router.get('/searchContacts',ctrl.searchContacts); //Página donde podemos buscar nuevos contactos y enviar peticiones de contacto
router.get('/chatroom', ctrl.chatroom); //Sala de chat
router.get('/personalPage',ctrl.personalPage); //Página personal de cada usuario donde puede ver sus contactos y salas

module.exports = router;