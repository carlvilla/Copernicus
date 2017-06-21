var copernicus = angular.module('copernicus');

copernicus.controller('serviciosController', function ($scope, utils, $compile, $translate) {

    //Primero cargamos los htmls de los módulos
    //Es necesario hacer esto en primer lugar, no se puede cargar el html una vez se va a añadir ya que no se cargará
    //a tiempo
    var htmlChatVideo;
    var htmlPresentaciones;
    var htmlDibujo;
    var htmlChatTexto;
    var htmlRadio;
    var htmlVideoCompartido;

    var serviciosAbiertos = [];

    $.get("/servicios/chatVideo.ejs", function (html) {
        htmlChatVideo = html;
    });

    $.get("/servicios/chatTexto.ejs", function (html) {
        htmlChatTexto = html;
    });

    $.get("/servicios/presentaciones.ejs", function (html) {
        htmlPresentaciones = html;
    });

    $.get("/servicios/dibujo.ejs", function (html) {
        htmlDibujo = html;
    });

    $.get("/servicios/radio.ejs", function (html) {
        htmlRadio = html;
    });

    $.get("/servicios/videoCompartido.ejs", function (html) {
        htmlVideoCompartido = html;
    });

    var options = {
        float:true
    };


    $('.grid-stack').gridstack(options);

    var grid = $('.grid-stack').data('gridstack');

    $scope.addServicio = function (servicio) {


        //Valores por defecto
        var node = {
            width: 5,
            height: 5,
            minWidth: 3,
            maxWidth: 8,
            minHeight: 3,
            maxHeight: 8
        };

        //Solo se pueden utilizar 4 módulos simultáneamente
        if(serviciosAbiertos.length > 3){
            utils.mensajeInfo($translate.instant('MAX_SERVICIOS'));
            return;
        }

        switch (servicio) {
            case "chatVideo":
                servicioSeleccionado = htmlChatVideo;

                if(!contains(serviciosAbiertos,"chatVideo")){
                    serviciosAbiertos.push("chatVideo");

                    node = {
                        width: 5,
                        height: 5,
                        minWidth: 3,
                        maxWidth: 9,
                        minHeight: 3,
                        maxHeight: 9
                    };

                }else{
                    utils.mensajeInfo($translate.instant('CHAT_VIDEO_UTILIZANDO'));
                    return;
                }
                break;

            case "chatTexto":
                servicioSeleccionado = htmlChatTexto;

                if(!contains(serviciosAbiertos,"chatTexto")){
                    serviciosAbiertos.push("chatTexto");

                     node = {
                        width: 4,
                        height: 5,
                        minWidth: 4,
                        maxWidth: 5,
                        minHeight: 5,
                        maxHeight: 7
                    };

                }else{
                    utils.mensajeInfo($translate.instant('CHAT_TEXTO_UTILIZANDO'));
                    return;
                }
                break;

            case "presentaciones":
                servicioSeleccionado = htmlPresentaciones;

                if(!contains(serviciosAbiertos,"presentaciones")){
                    serviciosAbiertos.push("presentaciones");
                }else{
                    utils.mensajeInfo($translate.instant('PRESENTACIONES_UTILIZANDO'));
                    return;
                }
                break;

            case "dibujo":
                servicioSeleccionado = htmlDibujo;

                if(!contains(serviciosAbiertos,"dibujo")){
                    serviciosAbiertos.push("dibujo");
                }else{
                    utils.mensajeInfo($translate.instant('DIBUJOS_UTILIZANDO'));
                    return;
                }
                break;

            case "videoCompartido":
                servicioSeleccionado = htmlVideoCompartido;

                if(!contains(serviciosAbiertos,"videoCompartido")){
                    serviciosAbiertos.push("videoCompartido");

                    node = {
                        width: 5,
                        height: 5,
                        minWidth: 4,
                        maxWidth: 8,
                        minHeight: 4,
                        maxHeight: 7
                    };

                }else{
                    utils.mensajeInfo($translate.instant('VIDEO_COMPARTIDO_UTILIZANDO'));
                    return;
                }
                break;

            case "radio":
                servicioSeleccionado = htmlRadio;

                if(!contains(serviciosAbiertos,"radio")){
                    serviciosAbiertos.push("radio");

                    node = {
                        width: 3,
                        height: 1,
                        minWidth: 3,
                        maxWidth: 3,
                        minHeight: 1,
                        maxHeight: 1
                    };

                }else{
                    utils.mensajeInfo($translate.instant('RADIO_UTILIZANDO'));
                    return;
                }
                break;

            default:
                break;
        }

        grid.addWidget($(servicioSeleccionado),
            0, 0, node.width, node.height, true, node.minWidth, node.maxWidth, node.minWidth, node.maxHeight);

        $compile('#'+servicio)($scope);
    };


    function contains(array, obj) {
        var i = array.length;
        while (i--) {
            if (array[i] === obj) {
                return true;
            }
        }
        return false;
    }

    $scope.eliminarServicio = function (servicio){
        serviciosAbiertos.splice(serviciosAbiertos.indexOf(servicio), 1);
        grid.removeWidget($('#'+servicio));
    };




});