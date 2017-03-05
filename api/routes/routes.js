var express = require('express');
var controller = require('../controllers/userController');
var router = express.Router();

router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/validarUsername/:username', controller.validarUsername);

module.exports = router;
