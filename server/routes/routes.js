var express = require('express');
var router = express.Router();
var ctrl = require('../controllers/pagesControllers');
var middleware = require('./middleware');

router.get('/', middleware.checkSesion ,ctrl.index);
router.get('/about', ctrl.about); //Página de información
router.get('/index', middleware.checkSesion, ctrl.index); //Página de login y registro
router.get('/profile', middleware.checkToken, ctrl.profile); //Página en la que el usuario puede cambiar sus datos personales
router.get('/searchContacts', middleware.checkToken, ctrl.searchContacts); //Página donde podemos buscar nuevos contactos y enviar peticiones de contacto
router.get('/chatroom', middleware.checkToken, ctrl.chatroom); //Sala de chat
router.get('/personalPage', middleware.checkToken, ctrl.personalPage); //Página personal de cada usuario donde puede ver sus contactos y salas
router.get('/manageRooms', middleware.checkToken, ctrl.manageRooms); //Página en la que se gestionan las salas y los participantes de las mismas

module.exports = router;