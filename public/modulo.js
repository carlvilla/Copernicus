var copernicus = angular.module('copernicus', ['ngCookies', 'angular-websocket', 'angucomplete', 'ngFileUpload'
    , 'angular-growl', 'pascalprecht.translate', 'ngImgCrop', "ngSanitize", "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls", 'youtube-embed']);

copernicus.config(['$translateProvider', function ($translateProvider) {

    $translateProvider.translations('es', {
        "PAGINA_PRINCIPAL": "Página Principal",
        "REGISTRO": 'Registro',
        "LOGIN": 'Iniciar Sesión',
        "INICIANDO_SESION": 'Iniciando sesión...',
        "OLVIDO": "¿Olvidaste la contraseña?",
        "USUARIO": "usuario",
        "USUARIOS": "usuarios",
        "USERNAME": 'Nombre de usuario',
        "NOMBRE": 'Nombre',
        "APELLIDOS": 'Apellidos',
        "EMAIL": 'Correo electrónico',
        "PASS": 'Contraseña',
        "PASS_CONF": 'Confirmar contraseña',
        "REGISTRARSE": 'Registrarse',
        "DIFF_PASS": 'Las contraseñas no coinciden',
        "COMPROBAR_USERNAME": 'Comprobando validez del nombre de usuario...',
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
        "NOMBRE_SALA": 'Nombre de la sala',
        "FILTRAR_CONTACTOS": 'Filtrar contactos',
        "FILTRAR_SALAS": 'Filtrar salas',
        "PARTICIPANTES": 'Participantes',
        "SERVICIOS": 'Servicios',
        "GESTIONAR_SALAS": 'Gestionar salas',
        "SELECCIONAR_SALA": 'Seleccione una sala de los listados a la izquierda para editarla',
        "SALAS_MODERADOR": 'Salas en las que es moderador',
        "PAGINA_PERSONAL": 'Página personal',
        "SALAS_ADMIN": 'Salas en las que es administrador',
        "SALAS_MIEMBRO": 'Salas en las que es miembro',
        "DATOS_ACTUALIZADOS": 'Datos de la sala actualizados',
        "INFO_SALA": 'Información de la sala',
        "ACTUALIZAR_DATOS":'Actualizar datos',
        "USUARIOS_SALA": 'Usuarios de la sala',
        "ACCIONES":'Acciones',
        "ADMIN": 'Administrador',
        "ACCIONES_PELIGROSAS": ' Acciones peligrosas',
        "ELIMINAR_SALA": 'Eliminar sala',
        "CHAT_VIDEO": 'Videollamada',
        "CHAT_TEXTO": 'Chat de texto',
        "PRESENTACIONES": 'Presentaciones',
        "VIDEO_COMPARTIDO": 'Video compartido',
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
        "ESTADO": 'Estado',
        "SELECCIONA_FOTO_PERFIL": 'Selecciona una foto de perfil',
        "USERNAME_NO_ESPACIOS": 'El nombre de usuario no puede contener espacios',
        "FOTO_SALA": 'Foto de la sala',
        "FOTO_PERFIL": 'Foto de perfil',
        "ELIMINAR_CUENTA": 'Eliminar cuenta',
        "CHAT_VIDEO_UTILIZANDO": 'El chat de video está siendo utilizado',
        "CHAT_TEXTO_UTILIZANDO": 'El chat de texto está siendo utilizado',
        "RADIO_UTILIZANDO": 'La radio está siendo utilizada',
        "PRESENTACIONES_UTILIZANDO": 'El servicio de presentaciones está siendo utilizado',
        "DIBUJOS_UTILIZANDO": 'El servicio de dibujos está siendo utilizado',
        "VIDEO_COMPARTIDO_UTILIZANDO": 'El video compartido está siendo utilizado',
        "MAX_SERVICIOS": 'No se pueden utilizar más de 4 servicios simultáneamente',
        "ACTUALIZAR_PASS": 'Actualizar contraseña',
        "DATOS_ACTUALIZADOS_CORRECTAMENTE": 'Datos actualizados correctamente',
        "NOMBRE_SALA_NO_VACIO": 'El nombre de la sala no puede estar vacio',
        "NOMBRE_ERRONEO": 'El nombre solo puede tener entre 2 y 15 carácteres',
        "APELLIDOS_ERRONEO": 'Los apellidos solo pueden tener hasta 35 carácteres',
        "EMAIL_ERRONEO": 'El formato del email es erróneo',
        "ACTUALIZANDO_DATOS": 'Actualizando datos...',
        "PASS_MODIFICADA": 'Contraseña modificada correctamente',
        "PASS_ERRONEO": 'No se ha autorizado la modificación de la contraseña',
        "ESTA_SEGURO_?": '¿Está seguro?',
        "ESTA_SEGURO_ELIMINAR_CUENTA?": '¿Está seguro de que quiere eliminar su cuenta? Esta acción no se puede deshacer.',
        "ESTA_SEGURO_ELIMINAR_SALA?": '¿Está seguro de que quiere eliminar esta sala? Esta acción no se puede deshacer.',
        "CUENTA_ERRONEO": 'Se ha producido un error eliminando la cuenta',
        "MODIFICAR_DATOS_CUENTA": 'Modificar datos de la cuenta',
        "CAMBIAR_FOTO": 'Cambiar foto de perfil',
        "CAMBIAR_PASS": 'Cambiar contraseña',
        "PASS_ACTUAL": 'Contraseña actual',
        "PASS_NUEVA": 'Nueva Contraseña',
        "PASS_NUEVA_REPETIR": 'Repetir Contraseña',
        "NO_PARTICIPANTES": 'No hay participantes conectados',
        "BORRAR_TODO": 'Borrar todo',
        "FICHERO_SIZE_MAXIMO": 'Solo se pueden enviar ficheros de hasta 10MB',
        "PRESENTACION_SIZE_MAXIMO": 'La presentación no puede ser mayor de 5MB',
        "CAMBIAR_PRESENTACION": 'Cambiar presentación',
        "PRESENTACION_CAMBIADA": 'La presentación ha sido cambiada por ',
        "FICHERO_NO_VALIDO": 'El fichero enviado no es válido',
        "LIMITE_SALA": 'No puede haber más de 8 contactos en una sala',
        "EXPLICACION_SOLICITUDES_SALA": 'Indique si desea unirse a las siguientes salas o ignorar las solicitudes',
        "EXPLICACION_SOLICITUDES_CONTACTO": 'Indique si desea agregar a las siguientes personas o ignorar sus solicitudes',
        "FOTO_SIZE_MAXIMO": 'El tamaño máximo de la fotografía es de 8MB',
        "SOBRE_NOSOTROS": 'Sobre nosotros',
        "INFORMACION_CONTACTO": 'Información sobre el contacto',
        "ERROR_BLOQUEAR_CONTACTO": 'Hubo un error al bloquear el contacto',
        "USUARIO_BLOQUEADO": 'El usuario fue bloqueado',
        "NOMBRE_SALA_OBLIGATORIO": 'Es necesario proporcionar un nombre para la sala',
        "ACTUALIZANDO_SALA": 'Actualizando la sala...',
        "CREANDO_SALA": 'Creando la sala...',
        "RADIO": 'Radio',
        "VOLUMEN": 'Volumen',
        "INDICAR_URL": 'Indique la URL de una radio/canción para reproducirla',
        "CAMBIO_EMISORA": 'Emisora cambiada por ',
        "URL_NO_VALIDA": 'URL no válida',
        "CAMBIO_VIDEO": 'Video cambiado por ',
        "PREPARANDO_VIDEO": 'Preparando el video...',
        "URL_VIDEO": 'URL del video',
        "CAMBIAR": 'Cambiar',
        "SALIR_SALA": 'Salir de la sala',
        "SALIO_SALA": 'Ha salido de la sala correctamente',
        "ESTA_SEGURO_SALIR_SALA?": '¿Estás seguro de que quieres salir de esta sala? Esta acción no se puede deshacer.',
        "FICHERO_ENVIADO_FEEDBACK": 'Fichero enviado a '
    });

    $translateProvider.translations('en', {
        "PAGINA_PRINCIPAL": "Main Page",
        "REGISTRO": 'Sign up',
        "LOGIN": 'Login',
        "INICIANDO_SESION": 'Logging in...',
        "OLVIDO": "Did you forget your password?",
        "USUARIO": "user",
        "USUARIOS": "users",
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
        "SALAS_MIEMBRO": 'Rooms where you are member',
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
        "VIDEO_COMPARTIDO": 'Shared video',
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
        "ESTADO": 'State',
        "SELECCIONA_FOTO_PERFIL": 'Select profile photo',
        "USERNAME_NO_ESPACIOS": 'Username can not contain blanks',
        "FOTO_SALA": 'Photo of the room',
        "FOTO_PERFIL": 'Profile photo',
        "ELIMINAR_CUENTA": 'Delete account',
        "CHAT_VIDEO_UTILIZANDO": 'Video chat is being used',
        "CHAT_TEXTO_UTILIZANDO": 'Chat is being used',
        "RADIO_UTILIZANDO": 'Radio is being used',
        "PRESENTACIONES_UTILIZANDO": 'Presentations is being used',
        "DIBUJOS_UTILIZANDO": 'Draws is being used',
        "VIDEO_COMPARTIDO_UTILIZANDO": 'Shared video is being used',
        "MAX_SERVICIOS": 'No more than 4 services can be used simultaneously',
        "ACTUALIZAR_PASS": 'Update password',
        "DATOS_ACTUALIZADOS_CORRECTAMENTE": 'Correctly updated data',
        "NOMBRE_SALA_NO_VACIO": 'The name of room can not be empty',
        "NOMBRE_ERRONEO": 'The name can only be between 2 and 15 characters',
        "APELLIDOS_ERRONEO": 'Surnames can only have up to 35 characters',
        "EMAIL_ERRONEO": 'The email format is wrong',
        "ACTUALIZANDO_DATOS": 'Updating data...',
        "PASS_MODIFICADA": 'Password modified correctly',
        "PASS_ERRONEO": 'Password modification not allowed',
        "ESTA_SEGURO_?": 'Are you sure?',
        "ESTA_SEGURO_ELIMINAR_CUENTA?": 'Are you sure you want to delete your account? This action cannot be undone.',
        "ESTA_SEGURO_ELIMINAR_SALA?": 'Are you sure you want to delete this room? This action cannot be undone.',
        "CUENTA_ERRONEO": 'There was an error deleting the account',
        "MODIFICAR_DATOS_CUENTA": 'Change account data',
        "CAMBIAR_FOTO": 'Change profile photo',
        "CAMBIAR_PASS": 'Change password',
        "PASS_ACTUAL": 'Current password',
        "PASS_NUEVA": 'New password',
        "PASS_NUEVA_REPETIR": 'Repeat password',
        "NO_PARTICIPANTES": 'There is no online participants',
        "BORRAR_TODO": 'Clear all',
        "FICHERO_SIZE_MAXIMO": 'Files cannot be larger than 10MB',
        "PRESENTACION_SIZE_MAXIMO": 'The presentation cannot be larger than 5MB',
        "CAMBIAR_PRESENTACION": 'Change presentation',
        "PRESENTACION_CAMBIADA": 'The presentation was changed by ',
        "FICHERO_NO_VALIDO": 'The file sent is not valid',
        "LIMITE_SALA": 'There can be no more than 8 people in a room',
        "EXPLICACION_SOLICITUDES_SALA": 'Indicate if you want to join the following rooms or ignore the requests',
        "EXPLICACION_SOLICITUDES_CONTACTO": 'Indicate if you want to add the following people or ignore their requests',
        "FOTO_SIZE_MAXIMO": 'The photo cannot be larger than 8MB',
        "SOBRE_NOSOTROS": 'About us',
        "INFORMACION_CONTACTO": 'Contact information',
        "ERROR_BLOQUEAR_CONTACTO": 'There was an error blocking the contact',
        "USUARIO_BLOQUEADO": 'The user was blocked',
        "NOMBRE_SALA_OBLIGATORIO": 'It is necessary a room name',
        "CREANDO_SALA": 'Creating the room...',
        "ACTUALIZANDO_SALA": 'Updating the room...',
        "RADIO": 'Radio',
        "VOLUMEN": 'Volume',
        "INDICAR_URL": 'Enter a URL for a radio/song to play it',
        "CAMBIO_EMISORA": 'Broadcasting was changed by ',
        "URL_NO_VALIDA": 'Invalid URL',
        "CAMBIO_VIDEO": 'Video was changed by ',
        "PREPARANDO_VIDEO": 'Preparing the video...',
        "URL_VIDEO": 'Video URL',
        "CAMBIAR": 'Change',
        "SALIR_SALA": 'Leave room',
        "SALIO_SALA": 'You left the room successfully',
        "ESTA_SEGURO_SALIR_SALA?": 'Are you sure you want to leave this room? This action cannot be undone.',
        "FICHERO_ENVIADO_FEEDBACK": 'File sent to '

    })

    $translateProvider.preferredLanguage('es');
    $translateProvider.useSanitizeValueStrategy('escaped');

    //Utiliza cookies para recordar el último lenguaje seleccionado
    $translateProvider.useCookieStorage();

}]);