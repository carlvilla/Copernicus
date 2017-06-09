var webApp = angular.module('webApp');

webApp.controller('modulosController', function ($scope, utils, $compile, $translate) {

    //Primero cargamos los htmls de los módulos
    //Es necesario hacer esto en primer lugar, no se puede cargar el html una vez se va a añadir ya que no se cargará
    //a tiempo
    var htmlChatVideo;
    var htmlPresentaciones;
    var htmlDibujo;
    var htmlChatTexto;

    var modulosMostrados = [];

    $.get("/modulos/chatVideo.ejs", function (html) {
        htmlChatVideo = html;
    });

    $.get("/modulos/chatTexto.ejs", function (html) {
        htmlChatTexto = html;
    });

    $.get("/modulos/presentaciones.ejs", function (html) {
        htmlPresentaciones = html;
    });

    $.get("/modulos/dibujo.ejs", function (html) {
        htmlDibujo = html;
    });


    var options = {
        float:true
    };

    //Valores por defecto
    var node = {
        width: 5,
        height: 5,
        minWidth: 3,
        maxWidth: 8,
        minHeight: 3,
        maxHeight: 8
    };

    $('.grid-stack').gridstack(options);

    var grid = $('.grid-stack').data('gridstack');

    $scope.addModule = function (modulo) {

        //Solo se pueden utilizar 4 módulos simultáneamente
        if(modulosMostrados.length > 3){
            utils.mensajeInfo($translate.instant('MAX_SERVICIOS'));
            return;
        }

        switch (modulo) {
            case "chatVideo":
                moduloSeleccionado = htmlChatVideo;

                if(!contains(modulosMostrados,"chatVideo")){
                    modulosMostrados.push("chatVideo");

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
                moduloSeleccionado = htmlChatTexto;

                if(!contains(modulosMostrados,"chatTexto")){
                    modulosMostrados.push("chatTexto");

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
                moduloSeleccionado = htmlPresentaciones;

                if(!contains(modulosMostrados,"presentaciones")){
                    modulosMostrados.push("presentaciones");
                }else{
                    utils.mensajeInfo($translate.instant('PRESENTACIONES_UTILIZANDO'));
                    return;
                }


                break;

            case "dibujo":
                moduloSeleccionado = htmlDibujo;

                if(!contains(modulosMostrados,"dibujo")){
                    modulosMostrados.push("dibujo");
                }else{
                    utils.mensajeInfo($translate.instant('DIBUJOS_UTILIZANDO'));
                    return;
                }

                break;

            default:
                break;
        }

        grid.addWidget($(moduloSeleccionado),
            0, 0, node.width, node.height, true, node.minWidth, node.maxWidth, node.minWidth, node.maxHeight);

        $compile('#'+modulo)($scope);
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

    $scope.eliminarModulo = function (modulo){
        modulosMostrados.splice(modulosMostrados.indexOf(modulo), 1);
        grid.removeWidget($('#'+modulo));
    };




});