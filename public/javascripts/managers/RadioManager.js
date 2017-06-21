function RadioManager(ws, utils, $translate) {

    var music;
    var urlRadio;
    var username;
    var sala;

    this.inicializarServicio = function (usernameParam, salaParam) {
        music = document.getElementById('radio-audio');

        username = usernameParam;
        sala = salaParam;

        music.onerror = function () {
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
            if (music.paused) {
                music.play();
                $('#icono-play').attr('class', 'fa fa-4x fa-pause-circle');

            } else {
                music.pause();
                $('#icono-play').attr('class', 'fa fa-4x fa-play-circle');
            }
        } else {
            utils.mensajeInfo($translate.instant('INDICAR_URL'));
        }
    };

    this.setVolumen = function (volumenParam) {
        if (music)
            music.volume = volumenParam;
    };

    var sendData = function (url) {
        ws.send(JSON.stringify(
            {
                'seccion': 'radio',
                'data': {
                    'username': username,
                    'sala': sala,
                    'url': url
                }
            }));
    };
}