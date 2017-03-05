var express = require('express');
var jwt = require("jwt-simple");
var router = express.Router();
var ctrl = require('../controllers/pagesControllers');

router.get('/', ctrl.index);
router.get('/about', ctrl.about);
router.get('/index', ctrl.index);


// Middleware para verificar si existencia el token generado al iniciar sesión
//Todas las nuevas routas añadidas después de esta llamada necesitarán el token
router.use(function(req, res, next) {

    var token = req.cookies.token;

    if (token) {
        try {
            var payload = jwt.decode(token, process.env.JWT_SECRET);
            next();
        }

        catch (err) {
            res.redirect('./index');
            var payload = jwt.decode(token, process.env.JWT_SECRET);
            //En el caso de que el token hubiese expirado
            if (payload.exp <= moment().unix()) {
                res.redirect('./index');
                req.sub = payload.sub;
                next();
            }
        }

    }else {
        res.redirect('./index');
        return res.status(403).send({
            success: false,
            message: 'No existe token de sesión'
        });
    }
});


router.get('/profile', ctrl.profile); //Página en la que el usuario puede cambiar sus datos personales
router.get('/searchContacts',ctrl.searchContacts); //Página donde podemos buscar nuevos contactos y enviar peticiones de contacto
router.get('/chatroom', ctrl.chatroom); //Sala de chat
router.get('/personalPage',ctrl.personalPage); //Página personal de cada usuario donde puede ver sus contactos y salas

module.exports = router;