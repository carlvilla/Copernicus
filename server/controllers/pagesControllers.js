module.exports.about = function (req, res, next) {
    res.render('about', {});
};

module.exports.index = function (req, res, next) {
    res.render('index', {
        lang: {
            registro: 'Registro',
            olvido: "¿Olvidaste la contraseña?",
            username: 'Usuario',
            nombre: 'Nombre',
            apellidos: 'Apellidos',
            email: 'Correo electrónico',
            pass: 'Contraseña',
            passConf: 'Confirmar contraseña',
            registrarse: 'Registrarse',
            diffPass: 'Las contraseñas no coinciden',
            comprobarUsername: 'Comprobando validez del nombre de usuario....',
            usernameNotAvailable: 'Este nombre de usuario ya está en uso',
            iniciarSesion: 'Iniciar sesión',
            loginError: 'Usuario y/o contraseña incorrectas',
            about: "Sobre nosotros",
            paginaPersonal: 'Página personal'
        }

    });
}

module.exports.searchContacts = function (req, res, next) {
    res.render('searchContacts', {});
}

module.exports.personalPage = function (req, res, next) {
    console.log("Página personal");
    //console.log((req.headers["accept-language"]));
    res.render('personalPage', {
        lang: {
            contacts: 'Contactos',
            addContact: "Añadir contacto",
            solicitudesContacto: "Solicitudes de contacto",
            blockContact: 'Bloquear Contacto',
            rooms: 'Salas',
            createRoom: 'Crear sala',
            manageRooms: 'Gestionar salas',
            solicitudesSala: 'Solicitudes de salas',
            settings: 'Ajustes',
            accountSettings: 'Ajustes de la cuenta',
            logout: 'Cerrar sesión',
            myContacts: 'Mis Contactos',
            roomsAccess: 'Acceso a salas',
            addMiembros: 'Añadir miembros a la sala',
            datosSala: 'Datos de la sala',
            usuariosBloqueados: 'Usuarios bloqueados',
            desbloquear: 'Desbloquear',
            username: 'Nombre de usuario',
            apellidos: 'Apellidos',
            sinMensaje: 'Sin mensaje',
            paginaPersonal: 'Página personal'
        }

    });
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
            salasModerador: 'Salas en las que es moderador'
        }
    });
}

module.exports.profile = function (req, res, next) {
    res.render('profile', {});
}