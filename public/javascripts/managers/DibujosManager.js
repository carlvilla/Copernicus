function DibujosManager(ws) {

    var username;
    var sala;
    var canvas;

    this.inicializarModulo = function (usernameParam, salaParam) {
        canvas = new fabric.Canvas('area-dibujo');

        canvas.on('mouse:up', function (options) {
            if (canvas.isDrawingMode) {
                var numObjetos = canvas.getObjects().length - 1;

                var figura = {
                    tipo: 'dibujo',
                    datos: canvas.getObjects()[numObjetos]
                }

                mensaje = {
                    figura: figura,
                    accion: 'add'
                }

                sendData(mensaje);
            }

        });

        username = usernameParam;
        sala = salaParam;
    }

    this.addCirculo = function () {
        var figura = {
            tipo: 'circulo',

            datos: {
                radius: 10,
                fill: 'blue',
                left: 15,
                top: 15
            }
        };

        mensaje = {
            figura: figura,
            accion: 'add'
        }

        sendData(mensaje);
        this.accion(mensaje);

    };

    this.addRectangulo = function () {
        var figura = {
            tipo: 'rectangulo',

            datos: {
                width: 40,
                height: 20,
                fill: 'blue',
                left: 25,
                top: 25
            }
        };

        mensaje = {
            figura: figura,
            accion: 'add'
        }

        sendData(mensaje);
        this.accion(mensaje);

    };

    this.addTriangulo = function () {
        var figura = {
            tipo: 'triangulo',

            datos: {
                width: 30,
                height: 30,
                fill: 'blue',
                left: 35,
                top: 35
            }
        };

        mensaje = {
            figura: figura,
            accion: 'add'
        }

        sendData(mensaje);
        this.accion(mensaje);
    };

    this.dibujar = function () {
        canvas.isDrawingMode = true;
    };

    this.seleccionar = function () {
        canvas.isDrawingMode = false;
    };

    this.borrar = function () {
        var mensaje = {
            accion: 'clear'
        }
        sendData(mensaje);
        this.accion(mensaje);
    };

    this.accion = function (mensaje) {

        var fig;

        switch (mensaje.accion) {

            case 'add':

                switch (mensaje.figura.tipo) {
                    case 'circulo':
                        fig = new fabric.Circle(mensaje.figura.datos);
                        break;

                    case 'rectangulo':
                        fig = new fabric.Rect(mensaje.figura.datos);
                        break;

                    case 'triangulo':
                        fig = new fabric.Triangle(mensaje.figura.datos);
                        break;

                    case 'dibujo':
                        var dibujo = mensaje.figura.datos;
                        var fig = new fabric.Path();


                        //Copiamos los valores del dibujo que acabamos de hacer
                        // en el dibujo que se va a mostrar al usuario
                        for(var n in dibujo) fig[n]=dibujo[n];

                        break;


                }

                canvas.add(fig);

                break;

            case 'clear':
                canvas.clear();

                break;

        }


    };

    function sendData(mensaje) {
        ws.send(JSON.stringify(
            {
                'seccion': 'dibujos',
                'data': {
                    'username': username,
                    'sala': sala,
                    'figura': mensaje.figura,
                    'accion': mensaje.accion
                }

            }));
    }

}