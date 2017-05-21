module.exports.about = function (req, res, next) {
    res.render('about', {});
};

module.exports.index = function (req, res, next) {
    res.render('index');
}

module.exports.searchContacts = function (req, res, next) {
    res.render('searchContacts');
}

module.exports.personalPage = function (req, res, next) {
    console.log("Página personal");
    //console.log((req.headers["accept-language"]));
    res.render('personalPage');
}

module.exports.chatroom = function (req, res, next) {
    res.render('chatroom', {

        lang: {
            participantes: 'Participantes',
            servicios: 'Servicios'
        }
    });
}

module.exports.manageRooms = function (req, res, next){
    res.render('manageRooms', {
        lang: {
            gestionarSalas: 'Gestionar salas',
            paginaPersonal: 'Página personal',
            seleccionarSala: 'Seleccione una sala de los listados a la izquierda para editarla',
            salasAdmin: 'Salas en las que es administrador',
            salasModerador: 'Salas en las que es moderador',
            DATOS_ACTUALIZADOS: 'Datos de la sala actualizados'
        }
    });
}

module.exports.profile = function (req, res, next) {
    res.render('profile', {});
}