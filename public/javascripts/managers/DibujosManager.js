function DibujosManager(ws) {

    var username;
    var sala;
    var canvas;

    var figuraSeleccionda;

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
                };

                sendData(mensaje);
            }

        });


        canvas.on('object:selected', function (ev) {
            figuraSeleccionda = ev.target;
        });


        canvas.on('object:moving', function (ev) {
            mensaje = {
                figura: ev.target,
                idFiguraOriginal: figuraSeleccionda.id,
                accion: 'move'
            };

            sendData(mensaje);


        });

        username = usernameParam;
        sala = salaParam;
    }

    this.addCirculo = function () {
        var figura = {
            tipo: 'circle',

            datos: {
                radius: 10,
                fill: 'blue',
                left: 15,
                top: 15,
                id: new Date().getTime()
            }
        };

        mensaje = {
            figura: figura,
            accion: 'add'
        };

        sendData(mensaje);
        this.accion(mensaje);

    };

    this.addRectangulo = function () {
        var figura = {
            tipo: 'rect',

            datos: {
                width: 40,
                height: 20,
                fill: 'blue',
                left: 25,
                top: 25,
                id: new Date().getTime()
            }
        };

        mensaje = {
            figura: figura,
            accion: 'add'
        };

        sendData(mensaje);
        this.accion(mensaje);

    };

    this.addTriangulo = function () {
        var figura = {
            tipo: 'triangle',
            datos: {
                width: 30,
                height: 30,
                fill: 'blue',
                left: 35,
                top: 35,
                id: new Date().getTime()
            }
        };

        mensaje = {
            figura: figura,
            accion: 'add'
        };

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

        switch (mensaje.accion) {

            case 'add':
                addFigura(mensaje);
                break;

            case 'move':

                var figura = mensaje.figura;

                figura.id = mensaje.idFiguraOriginal;

                var men = {
                    figura: {
                        tipo: figura.type,
                        datos: figura,
                        idFiguraOriginal: figura.id
                    }
                };

                removeFigura(men);
                addFigura(men);

                break;

            case 'clear':
                canvas.clear();
                break;
        }
    };

    function removeFigura(mensaje) {

        var objects = canvas.getObjects();

        for (var i = 0, len = canvas.getObjects().length; i < len; i++) {
            if (objects[i]['id'] == mensaje.figura.idFiguraOriginal) {
                canvas.remove(objects[i]);
            }
        }

    }

    function addFigura(mensaje) {

        var figura;

        switch (mensaje.figura.tipo) {
            case 'circle':
                figura = new fabric.Circle(mensaje.figura.datos);
                break;

            case 'rect':
                figura = new fabric.Rect(mensaje.figura.datos);
                break;

            case 'triangle':
                figura = new fabric.Triangle(mensaje.figura.datos);
                break;

            case 'dibujo':
                var dibujo = mensaje.figura.datos;
                var figura = new fabric.Path();


                //Copiamos los valores del dibujo que acabamos de hacer
                // en el dibujo que se va a mostrar al usuario
                for (var n in dibujo) figura[n] = dibujo[n];

                break;
        }
        if (canvas)
            canvas.add(figura);

    }

    function sendData(mensaje) {
        ws.send(JSON.stringify(
            {
                'seccion': 'dibujos',
                'data': {
                    'username': username,
                    'sala': sala,
                    'figura': mensaje.figura,
                    'idFiguraOriginal': mensaje.idFiguraOriginal,
                    'accion': mensaje.accion
                }

            }));
    }

}