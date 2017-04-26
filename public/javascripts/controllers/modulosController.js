var webApp = angular.module('webApp');

webApp.controller('modulosController', function ($scope, $compile,webSocketService) {

    //Primero cargamos los htmls de los módulos
    //Es necesario hacer esto en primer lugar, no se puede cargar el html una vez se va a añadir ya que no se cargará
    //a tiempo
    var htmlVideoChat;
    var htmlPresentaciones;
    var htmlDibujo;

    var numModulosMostrados = 0;

    $.get("/modulos/chatVideo.ejs", function (html) {
        htmlVideoChat = html;
    });

    $.get("/modulos/presentaciones.ejs", function (html) {
        htmlPresentaciones = html;
    });

    $.get("/modulos/dibujo_corporativo.ejs", function (html) {
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
        if(numModulosMostrados > 3){
            return;
        }

        numModulosMostrados++;
        
        console.log("Añadiendo módulo: "+modulo);

        switch (modulo) {
            case "chatVideo":
                moduloSeleccionado = htmlVideoChat;
                break;

            case "presentaciones":
                moduloSeleccionado = htmlPresentaciones;
                break;

            case "dibujo":
                moduloSeleccionado = htmlDibujo;

            default:
                break;
        }

        grid.addWidget($(moduloSeleccionado),
            0, 0, node.width, node.height, true, node.minWidth, node.maxWidth, node.minWidth, node.maxHeight);


        $compile('.grid-stack')($scope);

        return false;
    };


    $scope.removeModule = function (modulo){
        console.log("Borrando módulo: "+modulo);
        numModulosMostrados--;
        grid.removeWidget($('#'+modulo));
    };

});