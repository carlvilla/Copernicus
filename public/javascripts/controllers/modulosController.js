var webApp = angular.module('webApp');

webApp.controller('modulosController', function ($scope, webSocketService) {


    $scope.activateView = function(ele) {
        $compile(ele.contents())($scope);
        $scope.$apply();
    };


    $scope.addModule = function(modulo){

        var myEl = angular.element( document.querySelector( '#modulos' ) );

        switch(modulo)
        {
            case "chatVideo":
                //Comunicar a todos los asistentes de que se añade este módulo
                //Habría que comprobar que no haya más de un número X de módulos, por ejemplo que no se
                //puedan utilizar más de 4 módulos de manera simultanea

                console.log("Añadiendo chat de video");


                $.get("/modulos/chatVideo.ejs", function (ejs) {
                    myEl.html(ejs);
                });

                var mController = angular.element(document.getElementById("modulos"));
                mController.scope().activateView(myEl);

               // webSocketService.videoconferenciaManager.init();

                //Una vez añadido, hay que desactivar la posibilidad de añadir el mismo servicio


                break;

            case "presentaciones":
                console.log("Añadiendo presentaciones");
                $.get("/modulos/presentaciones.ejs", function (ejs) {
                    myEl.append(ejs);
                });

                break;

            default:
                break;

        }




    }



    /*
    ko.components.register('dashboard-grid', {
        viewModel: {
            createViewModel: function (controller, componentInfo) {
                var ViewModel = function (controller, componentInfo) {
                    var grid = null;

                    this.widgets = controller.widgets;

                    this.afterAddWidget = function (items) {
                        if (grid == null) {
                            grid = $(componentInfo.element).find('.grid-stack').gridstack({
                                auto: false
                            }).data('gridstack');
                        }

                        var item = _.find(items, function (i) {
                            return i.nodeType == 1
                        });
                        grid.addWidget(item);
                        ko.utils.domNodeDisposal.addDisposeCallback(item, function () {
                            grid.removeWidget(item);
                        });
                    };
                };

                return new ViewModel(controller, componentInfo);
            }
        },
        template: {element:'modulo'}
    });


    $(function () {
        var Controller = function (widgets) {
            var self = this;

            this.widgets = ko.observableArray(widgets);

            this.addNewWidget = function () {
                this.widgets.push({
                    x: 0,
                    y: 0,
                    width: 6,
                    height: 7,
                    auto_position: true
                });
                return false;
            };

            this.deleteWidget = function (item) {
                self.widgets.remove(item);
                return false;
            };
        };

        var widgets = [
            {x: 7, y: 0, width: 6, height: 6},
            {x: 0, y: 0, width: 6, height: 6},
            {x: 7, y: 0, width: 6, height: 6},
            {x: 0, y: 0, width: 6, height: 6}
        ];

        var controller = new Controller(widgets);
        ko.applyBindings(controller);
    });


*/

});