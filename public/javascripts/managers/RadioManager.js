function RadioManager(ws, utils, $translate) {

    var usernameUsuario;
    var sala;
    var reproductor;
    var urlRadio;

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

    this.cambiarEmisoraRemoto = function (url, usernameRemoto) {
        utils.mensajeInfo($translate.instant('CAMBIO_EMISORA')+usernameRemoto);
        $('#radio-audio').attr("src", url);
        urlRadio = url;
        $('#icono-play').attr('class', 'fa fa-4x fa-play-circle');
        $('#url').val(url);

    };

    this.cambiarEmisora = function (url) {
        $('#radio-audio').attr("src", url);
        urlRadio = url;
        $('#icono-play').attr('class', 'fa fa-4x fa-play-circle');

        sendData(url);
    };

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

    this.setVolumen = function (volumenParam) {
        if (reproductor)
            reproductor.volume = volumenParam;
    };

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