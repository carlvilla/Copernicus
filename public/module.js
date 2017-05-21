var webApp = angular.module('webApp', ['ngCookies', 'angular-websocket', 'angucomplete', 'ngFileUpload'
    , 'angular-growl', 'pascalprecht.translate']);

webApp.config(['$translateProvider', function ($translateProvider) {

    $translateProvider.translations('es', {
        "PAGINA_PRINCIPAL": "Página Principal",
        "REGISTRO": 'Registro',
        "LOGIN": 'Iniciar Sesión',
        "OLVIDO": "¿Olvidaste la contraseña?",
        "USERNAME": 'Usuario',
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
        "ABOUT": "Sobre nosotros"
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
        "ABOUT": "About us"
    })


    $translateProvider.preferredLanguage('es');
    $translateProvider.useSanitizeValueStrategy('escaped');

    //Utiliza cookies para recordar el último lenguaje seleccionado
    $translateProvider.useCookieStorage();

}]);