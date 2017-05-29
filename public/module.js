var webApp = angular.module('webApp', ['ngCookies', 'angular-websocket', 'angucomplete', 'ngFileUpload'
    , 'angular-growl', 'pascalprecht.translate']);

webApp.config(['$translateProvider', function ($translateProvider) {

    $translateProvider.translations('es', {
        "PAGINA_PRINCIPAL": "Página Principal",
        "REGISTRO": 'Registro',
        "LOGIN": 'Iniciar Sesión',
        "OLVIDO": "¿Olvidaste la contraseña?",
        "USERNAME": 'Nombre de usuario',
        "NOMBRE": 'Nombre',
        "APELLIDOS": 'Apellidos',
        "EMAIL": 'Correo electrónico',
        "PASS": 'Contraseña',
        "PASS_CONF": 'Confirmar contraseña',
        "REGISTRARSE": 'Registrarse',
        "DIFF_PASS": 'Las contraseñas no coinciden',
        "COMPROBAR_USERNAME": 'Comprobando validez del nombre de usuario....',
        "USERNAME_NOT_AVAILABLE": 'Este nombre de usuario ya está en uso',
        "INICIAR_SESION": 'Iniciar sesión',
        "LOGIN_ERROR": 'Usuario y/o contraseña incorrectos',
        "ABOUT": "Sobre nosotros",
        "CONTACTOS": 'Contactos',
        "ADD_CONTACTO": "Añadir contacto",
        "ADD_USUARIO": "Añadir usuario",
        "SOLICITUDES_CONTACTO": "Solicitudes de contacto",
        "BLOQUEAR_CONTACTO": 'Bloquear Contacto',
        "SALAS": 'Salas',
        "CREAR_SALA": 'Crear sala',
        "GESTIONAR_SALA": 'Gestionar salas',
        "SOLICITUDES_SALAS": 'Solicitudes de salas',
        "AJUSTES": 'Ajustes',
        "AJUSTES_CUENTA": 'Ajustes de la cuenta',
        "CERRAR_SESION": 'Cerrar sesión',
        "MIS_CONTACTOS": 'Mis Contactos',
        "ACCESO_SALAS": 'Acceso a salas',
        "ADD_MIEMBROS": 'Añadir miembros a la sala',
        "DATOS_SALA": 'Datos de la sala',
        "USUARIOS_BLOQUEADOS": 'Usuarios bloqueados',
        "DESBLOQUEAR": 'Desbloquear',
        "SIN_MENSAJE": 'Sin mensaje',
        "BLOQUEAR_CONTACTO": 'Bloquear contacto',
        "MANDAR_SOLICITUD_CONTACTO": 'Mandar solicitud de contacto',
        "CERRAR": 'Cerrar',
        "DESCRIPCION_OPCIONAL": 'Descripción (Opcional)',
        "DESCRIPCION": 'Descripción',
        "ADMIN_ABRIR_CERRAR_SERVICIOS": 'Indicar si solo el administrador puede abrir y cerrar servicios',
        "PERMISOS": 'Permisos',
        "ELIMINAR": 'Eliminar',
        "MIEMBRO": 'Miembro',
        "MODERADOR": 'Moderador',
        "ACEPTAR": 'Aceptar',
        "IGNORAR": 'Ignorar',
        "NO_SOLICITUDES": 'No tienes solicitudes pendientes',
        "MENSAJE_ENVIADO_SOLICITUD": 'Mensaje enviado en la solicitud',
        "NOMBRE_SALA": 'Nombre sala',
        "FILTRAR_CONTACTOS": 'Filtrar contactos',
        "FILTRAR_SALAS": 'Filtrar sala',
        "PARTICIPANTES": 'Participantes',
        "SERVICIOS": 'Servicios',
        "GESTIONAR_SALAS": 'Gestionar salas',
        "SELECCIONAR_SALA": 'Seleccione una sala de los listados a la izquierda para editarla',
        "SALAS_MODERADOR": 'Salas en las que es moderador',
        "PAGINA_PERSONAL": 'Página personal',
        "SALAS_ADMIN": 'Salas en las que es administrador',
        "DATOS_ACTUALIZADOS": 'Datos de la sala actualizados',
        "INFO_SALA": 'Información de la sala',
        "ACTUALIZAR_DATOS":'Actualizar datos',
        "USUARIOS_SALA": 'Usuarios de la sala',
        "ACCIONES":'Acciones',
        "ADMIN": 'Administrador',
        "ACCIONES_PELIGROSAS": ' Acciones peligrosas',
        "ELIMINAR_SALA": 'Eliminar sala',
        "CHAT_VIDEO": 'Chat de video',
        "CHAT_TEXTO": 'Chat de texto',
        "PRESENTACIONES": 'Presentaciones',
        "VIDEO_AUDIO_COMPARTIDO": 'Video y audio compartido',
        "DIBUJOS": 'Dibujos',
        "DATOS_SALA_ACTUALIZADOS": 'Datos de la sala actualizados',
        "USUARIO_ADDED": 'Usuario añadido',
        "USUARIO_ALREADY_ADDED": 'Usuario ya añadido',
        "USUARIO_ELIMINADO": 'Usuario eliminado',
        "PERMISOS_USUARIO_CAMBIADOS": 'Los permisos del usuario fueron modificados',
        "SALA_ELIMINADA": 'Sala eliminada',
        "INVITACION_ENVIADA": 'Invitación para unirse a la sala enviada',
        "INVITACION_ELIMINADA": 'La invitación fue eliminada',
        "OPERACION_NO_AUTORIZADA": 'La operación no ha sido autorizada',
        "INVITACIONES_ENVIADAS": 'Invitaciones enviadas',
        "INVITACION_NO_ACEPTADA": 'Todavía no ha aceptado la invitación',
        "CANCELAR_INVITACION": 'Cancelar invitación',
        "ESTADO": 'Estado'
    });

    $translateProvider.translations('en', {
        "PAGINA_PRINCIPAL": "Main Page",
        "REGISTRO": 'Sign up',
        "LOGIN": 'Login',
        "OLVIDO": "Did you forget your password?",
        "USERNAME": 'Username',
        "NOMBRE": 'Name',
        "APELLIDOS": 'Surname',
        "EMAIL": 'Email',
        "PASS": 'Password',
        "PASS_CONF": 'Confirm password',
        "REGISTRARSE": 'Sign up',
        "DIFF_PASS": "The passwords don't match",
        "COMPROBAR_USERNAME": 'Checking if the username is valid...',
        "USERNAME_NOT_AVAILABLE": 'Username is already taken',
        "INICIAR_SESION": 'Login',
        "LOGIN_ERROR": 'Incorrect username and/or password',
        "ABOUT": "About us",
        "CONTACTOS": 'Contacts',
        "ADD_CONTACTO": "Add contact",
        "ADD_USUARIO": "Add user",
        "SOLICITUDES_CONTACTO": "Contact requests",
        "BLOQUEAR_CONTACTO": "Block contact",
        "SALAS": "Rooms",
        "CREAR_SALA": 'Create room',
        "GESTIONAR_SALA": 'Manage rooms',
        "SOLICITUDES_SALAS": 'Room requests',
        "AJUSTES": 'Settings',
        "AJUSTES_CUENTA": 'Account settings',
        "CERRAR_SESION": 'Logout',
        "MIS_CONTACTOS": 'My contacts',
        "ACCESO_SALAS": 'Room access',
        "ADD_MIEMBROS": 'Add members to the room',
        "DATOS_SALA": 'Room details',
        "USUARIOS_BLOQUEADOS": 'Blocked users',
        "DESBLOQUEAR": 'Unblock',
        "SIN_MENSAJE": 'Without message',
        "BLOQUEAR_CONTACTO": 'Block contact',
        "MANDAR_SOLICITUD_CONTACTO": 'Send contact request',
        "CERRAR": 'Close',
        "DESCRIPCION_OPCIONAL": 'Description (Optional)',
        "DESCRIPCION": 'Description',
        "ADMIN_ABRIR_CERRAR_SERVICIOS": 'Only Admin can open and close services',
        "PERMISOS": 'Permits',
        "ELIMINAR": 'Remove',
        "MIEMBRO": 'Member',
        "MODERADOR": 'Moderator',
        "ACEPTAR": 'Accept',
        "IGNORAR": 'Ignore',
        "NO_SOLICITUDES": 'No pending requests',
        "MENSAJE_ENVIADO_SOLICITUD": 'Message sent in the request',
        "NOMBRE_SALA": 'Room name',
        "FILTRAR_CONTACTOS": 'Filter contacts',
        "FILTRAR_SALAS": 'Filter rooms',
        "PARTICIPANTES": 'Participants',
        "SERVICIOS": 'Services',
        "GESTIONAR_SALAS": 'Manage rooms',
        "SELECCIONAR_SALA": 'Select a room from the lists at the left to edit it',
        "SALAS_MODERADOR": 'Rooms where you are moderator',
        "PAGINA_PERSONAL": 'Personal page',
        "SALAS_ADMIN": 'Rooms where you are admin',
        "DATOS_ACTUALIZADOS": 'Room updated',
        "INFO_SALA": 'Room information',
        "ACTUALIZAR_DATOS":'Update data',
        "USUARIOS_SALA": 'Users of the room',
        "ACCIONES":'Actions',
        "ADMIN": 'Admin',
        "ACCIONES_PELIGROSAS": ' Dangerous actions',
        "ELIMINAR_SALA": 'Remove room',
        "CHAT_VIDEO": 'Video chat',
        "CHAT_TEXTO": 'Chat',
        "PRESENTACIONES": 'Presentations',
        "VIDEO_AUDIO_COMPARTIDO": 'Shared video and audio',
        "DIBUJOS": 'Draws',
        "DATOS_SALA_ACTUALIZADOS": 'Room data updated',
        "USUARIO_ADDED": 'User added',
        "USUARIO_ALREADY_ADDED": 'User already added',
        "USUARIO_ELIMINADO": 'User removed',
        "PERMISOS_USUARIO_CAMBIADOS": "User permissions were changed",
        "SALA_ELIMINADA": 'Room deleted',
        "INVITACION_ENVIADA": 'Invitation to join the room sent',
        "INVITACION_ELIMINADA": 'The invitation was deleted',
        "OPERACION_NO_AUTORIZADA": 'Operation not authorised',
        "INVITACIONES_ENVIADAS": 'Invitations sent',
        "INVITACION_NO_ACEPTADA": 'Invitation not accepted yet',
        "CANCELAR_INVITACION": 'Cancel invitation',
        "ESTADO": 'State'
    })


    $translateProvider.preferredLanguage('es');
    $translateProvider.useSanitizeValueStrategy('escaped');

    //Utiliza cookies para recordar el último lenguaje seleccionado
    $translateProvider.useCookieStorage();

}]);