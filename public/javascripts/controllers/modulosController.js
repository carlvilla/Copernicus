var webApp = angular.module('webApp');

webApp.controller('modulosController', function ($scope, $compile,webSocketService) {

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

    var node = {
        width: 5,
        height: 5,
        minWidth: 3,
        maxWidth: 8,
        minHeight: 3,
        maxHeight: 8
    }

    $('.grid-stack').gridstack(options);

    var grid = $('.grid-stack').data('gridstack');

    $scope.addModule = function (modulo) {

        //Por el momento solo se pueden utilizar 4 módulos simultáneamente
        if(modulosMostrados.length > 3){
            return;
        }

        console.log("Añadiendo módulo: "+modulo);

        switch (modulo) {
            case "chatVideo":
                moduloSeleccionado = htmlChatVideo;

                if(!contains(modulosMostrados,"chatVideo")){
                    modulosMostrados.push("chatVideo");
                }else{
                    console.log("No se ha podido añadir el módulo "+modulo+", ya que existe uno en pantalla");
                    return;
                }

                break;


            case "chatTexto":
                moduloSeleccionado = htmlChatTexto;

                if(!contains(modulosMostrados,"chatTexto")){
                    modulosMostrados.push("chatVideo");
                }else{
                    console.log("No se ha podido añadir el módulo "+modulo+", ya que existe uno en pantalla");
                    return;
                }

                break;


            case "presentaciones":
                moduloSeleccionado = htmlPresentaciones;

                if(!contains(modulosMostrados,"presentaciones")){
                    modulosMostrados.push("presentaciones");
                }else{
                    console.log("No se ha podido añadir el módulo "+modulo+", ya que existe uno en pantalla");
                    return;
                }


                break;

            case "dibujo":
                moduloSeleccionado = htmlDibujo;
                modulosMostrados.push("dibujo");
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
        console.log("Borrando módulo: "+modulo);
        modulosMostrados.splice(modulo, 1);
        grid.removeWidget($('#'+modulo));
    };

});