var copernicus = angular.module('copernicus');

/**
 * @ngdoc controller
 * @name copernicus.controller:serviciosController
 *
 * @description
 * Este controlador está encargado de gestionar los servicios de las salas.
 *
 */
copernicus.controller('serviciosController', function ($scope, utils, $compile, $translate) {

    //Primero cargamos los htmls de los módulos
    //Es necesario hacer esto en primer lugar, no se puede cargar el html una vez se va a añadir ya que no se cargará
    //a tiempo

    /**
     * @ngdoc property
     * @name htmlVideollamada
     * @propertyOf copernicus.controller:serviciosController
     * @description
     * HTML del servicio de videollamada.
     *
     **/
    var htmlVideollamada;

    /**
     * @ngdoc property
     * @name htmlPresentaciones
     * @propertyOf copernicus.controller:serviciosController
     * @description
     * HTML del servicio de presentaciones.
     *
     **/
    var htmlPresentaciones;

    /**
     * @ngdoc property
     * @name htmlDibujo
     * @propertyOf copernicus.controller:serviciosController
     * @description
     * HTML del servicio de dibujo.
     *
     **/
    var htmlDibujo;

    /**
     * @ngdoc property
     * @name htmlChatTexto
     * @propertyOf copernicus.controller:serviciosController
     * @description
     * HTML del servicio de chat de texto.
     *
     **/
    var htmlChatTexto;

    /**
     * @ngdoc property
     * @name htmlRadio
     * @propertyOf copernicus.controller:serviciosController
     * @description
     * HTML del servicio de radio.
     *
     **/
    var htmlRadio;

    /**
     * @ngdoc property
     * @name htmlVideoCompartido
     * @propertyOf copernicus.controller:serviciosController
     * @description
     * HTML del servicio de video compartido.
     *
     **/
    var htmlVideoCompartido;

    /**
     * @ngdoc property
     * @name serviciosAbiertos
     * @propertyOf copernicus.controller:serviciosController
     * @description
     * Listado de servicio abiertos.
     *
     **/
    var serviciosAbiertos = [];

    $.get("/servicios/chatVideo.ejs", function (html) {
        htmlVideollamada = html;
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


    /**
     * @ngdoc property
     * @name options
     * @propertyOf copernicus.controller:serviciosController
     * @description
     * Objeto de configuración para Gridstack.js
     *
     **/
    var options = {
        float:true
    };

    $('.grid-stack').gridstack(options);

    var grid = $('.grid-stack').data('gridstack');

    /**
     * @ngdoc method
     * @name addServicio
     * @methodOf copernicus.controller:serviciosController
     * @description
     * Abre un servicio.
     *
     * @param {String} servicio Servicio que se va a abrir.
     *
     **/
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

        switch (servicio) {
            case "chatVideo":
                servicioSeleccionado = htmlVideollamada;

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

    /**
     * @ngdoc method
     * @name contains
     * @methodOf copernicus.controller:serviciosController
     * @description
     * Comprueba si un array contiene cierto objeto.
     *
     * @param {object[]} array Array en el que se busca.
     * @param {object} obj Objeto que se busca.
     *
     **/
    function contains(array, obj) {
        var i = array.length;
        while (i--) {
            if (array[i] === obj) {
                return true;
            }
        }
        return false;
    }

    /**
     * @ngdoc method
     * @name eliminarServicio
     * @methodOf copernicus.controller:serviciosController
     * @description
     * Cierra un servicio.
     *
     * @param {String} servicio Servicio que se quiere cerrar.
     *
     **/
    $scope.eliminarServicio = function (servicio){
        serviciosAbiertos.splice(serviciosAbiertos.indexOf(servicio), 1);
        grid.removeWidget($('#'+servicio));
    };




});