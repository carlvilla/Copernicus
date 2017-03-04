module.exports.about = function(req, res, next) {
    res.render('about', {});
};

module.exports.index = function(req, res, next){
    res.render('index', {
        lang:{
            registro: 'Registro',
            olvido:"¿Olvidaste la contraseña?",
            username: 'Usuario',
            nombre: 'Nombre',
            apellidos: 'Apellidos',
            email: 'Correo electrónico',
            pass: 'Contraseña',
            passConf: 'Confirmar contraseña',
            registrarse: 'Registrarse',
            diffPass: 'Las contraseñas no coinciden',
            comprobarUsername: 'Comprobando validez del nombre de usuario....',
            usernameNotAvailable: 'Este nombre de usuario ya está en uso'
        }

    });
}

module.exports.searchContacts = function(req, res, next){
    res.render('searchContacts', {});
}

module.exports.personalPage = function(req, res, next){
    res.render('personalPage', {});
}

module.exports.chatroom = function(req, res, next){
    res.render('chatroom', {});
}

module.exports.register = function(req, res, next){
    res.render('register', {});
}

module.exports.profile = function(req, res, next){
    res.render('profile', {});
}