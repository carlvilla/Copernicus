/**
 * @ngdoc function
 * @name copernicus.function:RadioManager
 * @description
 * Este manager se encarga de la gestión del servicio de radio.
 */
function RadioManager(ws, utils, $translate) {

    /**
     * @ngdoc property
     * @name usernameUsuario
     * @propertyOf copernicus.function:RadioManager
     * @description
     * Nombre de usuario del usuario.
     *
     **/
    var usernameUsuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.function:RadioManager
     * @description
     * ID de la sala.
     *
     **/
    var sala;

    /**
     * @ngdoc property
     * @name reproductor
     * @propertyOf copernicus.function:RadioManager
     * @description
     * Reproductor de música.
     *
     **/
    var reproductor;

    /**
     * @ngdoc property
     * @name urlRadio
     * @propertyOf copernicus.function:RadioManager
     * @description
     * URL de la radio o canción que se está utilizando.
     *
     **/
    var urlRadio;

    /**
     * @ngdoc method
     * @name inicializar
     * @methodOf copernicus.function:RadioManager
     * @description
     * Inicializa los valores de los atributoes 'reproductor', 'usernameUsuario' y 'sala'. En el caso de que el atributo
     * 'urlRadio' tuviese algún valor, eso significa que otro usuario pasó una URL antes de abrir el
     * servicio por lo que se establece como la URL a reproducir.
     *
     * @param {String} username Nombre de usuario del usuario.
     * @param {String} salaParam ID de la sala.
     *
     **/
    this.inicializar = function (usernameParam, salaParam) {
        reproductor = document.getElementById('radio-audio');

        usernameUsuario = usernameParam;
        sala = salaParam;

        reproductor.onerror = function () {
            utils.mensajeError($translate.instant('URL_NO_VALIDA'));
            urlRadio = undefined;
        };

        if(urlRadio){
            $('#radio-audio').attr("src", urlRadio);
            $('#url').val(urlRadio);
        }

    };

    /**
     * @ngdoc method
     * @name cambiarEmisoraRemoto
     * @methodOf copernicus.function:RadioManager
     * @description
     * Recibe la URL de la emisora que fue introducida por otro usuario.
     *
     * @param {String} url URL de la nueva emisora.
     * @param {String} usernameRemoto Nombre de usuario del usuario que cambio la URL.
     *
     **/
    this.cambiarEmisoraRemoto = function (url, usernameRemoto) {
        utils.mensajeInfo($translate.instant('CAMBIO_EMISORA')+usernameRemoto);
        $('#radio-audio').attr("src", url);
        urlRadio = url;
        $('#icono-play').attr('class', 'fa fa-4x fa-play-circle');
        $('#url').val(url);

    };

    /**
     * @ngdoc method
     * @name cambiarEmisora
     * @methodOf copernicus.function:RadioManager
     * @description
     * Modifica la URL a reproducir.
     *
     * @param {String} url URL de la nueva emisora.
     *
     **/
    this.cambiarEmisora = function (url) {
        $('#radio-audio').attr("src", url);
        urlRadio = url;
        $('#icono-play').attr('class', 'fa fa-4x fa-play-circle');

        sendData(url);
    };

    /**
     * @ngdoc method
     * @name play
     * @methodOf copernicus.function:RadioManager
     * @description
     * Comienza la reproduciendo de la radio o canción.
     *
     **/
    this.play = function () {
        if (urlRadio) {
            if (reproductor.paused) {
                reproductor.play();
                $('#icono-play').attr('class', 'fa fa-4x fa-pause-circle');

            } else {
                reproductor.pause();
                $('#icono-play').attr('class', 'fa fa-4x fa-play-circle');
            }
        } else {
            utils.mensajeInfo($translate.instant('INDICAR_URL'));
        }
    };

    /**
     * @ngdoc method
     * @name setVolumen
     * @methodOf copernicus.function:RadioManager
     * @description
     * Modifica el volumen del sonido.
     *
     * @param {double} volumenParam Volumen establecido.
     *
     **/
    this.setVolumen = function (volumenParam) {
        if (reproductor)
            reproductor.volume = volumenParam;
    };

    /**
     * @ngdoc method
     * @name sendData
     * @methodOf copernicus.function:RadioManager
     * @description
     * Envía la URL establecida al resto de usuarios conectados a la sala.
     *
     * @param {String} url URL de la radio o canción establecida.
     *
     **/
    var sendData = function (url) {
        ws.send(JSON.stringify(
            {
                'seccion': 'radio',
                'data': {
                    'username': usernameUsuario,
                    'sala': sala,
                    'url': url
                }
            }));
    };
}