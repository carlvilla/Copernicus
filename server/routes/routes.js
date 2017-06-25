/**
 * @ngdoc function
 * @name copernicus.function:routes
 *
 * @description
 * Redirecciona las peticiones del usuario a los controladores correspondientes.
 */

/**
 * @ngdoc property
 * @name express
 * @propertyOf copernicus.function:routes
 * @description
 * Módulo 'express'.
 *
 **/
var express = require('express');

/**
 * @ngdoc property
 * @name router
 * @propertyOf copernicus.function:routes
 * @description
 * Router obtenido a partir del modulo 'express'.
 *
 **/
var router = express.Router();

/**
 * @ngdoc property
 * @name ctrl
 * @propertyOf copernicus.function:routes
 * @description
 * Referencia a 'PagesControllers'.
 *
 **/
var ctrl = require('../controllers/pagesControllers');

/**
 * @ngdoc property
 * @name middleware
 * @propertyOf copernicus.function:routes
 * @description
 * Referencia a 'Middleware'.
 *
 **/
var middleware = require('./middleware');

router.get('/', middleware.checkSesion ,ctrl.index);
router.get('/index', middleware.checkSesion, ctrl.index); //Página de login y registro
router.get('/chatroom', middleware.checkToken, ctrl.chatroom); //Sala de chat
router.get('/mainPage', middleware.checkToken, ctrl.mainPage); //Página personal de cada usuario donde puede ver sus contactos y salas
router.get('/manageRooms', middleware.checkToken, ctrl.manageRooms); //Página en la que se gestionan las salas y los participantes de las mismas
router.get('/profileSettings', middleware.checkToken, ctrl.profileSettings); //Página en la que se modifican los datos de la cuenta
router.get('/about', ctrl.about); //Página de información sobre contacto
router.get('/legal', ctrl.legal); //Página de información legal

module.exports = router;