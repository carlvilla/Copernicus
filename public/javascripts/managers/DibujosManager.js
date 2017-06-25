/**
 * @ngdoc function
 * @name copernicus.function:DibujosManager
 * @description
 * Este manager se encarga de la gestión del servicio de dibujos.
 */
function DibujosManager(ws) {

    /**
     * @ngdoc property
     * @name usernameUsuario
     * @propertyOf copernicus.function:DibujosManager
     * @description
     * Nombre de usuario del usuario.
     *
     **/
    var usernameUsuario;

    /**
     * @ngdoc property
     * @name sala
     * @propertyOf copernicus.function:DibujosManager
     * @description
     * ID de la sala.
     *
     **/
    var sala;

    /**
     * @ngdoc property
     * @name canvas
     * @propertyOf copernicus.function:DibujosManager
     * @description
     * Canvas en las que se muestran las figuras y dibujos.
     *
     **/
    var canvas;

    /**
     * @ngdoc property
     * @name figuraSeleccionda
     * @propertyOf copernicus.function:DibujosManager
     * @description
     * Figura seleccionada para su manipulación.
     *
     **/
    var figuraSeleccionda;

    /**
     * @ngdoc method
     * @name inicializar
     * @methodOf copernicus.function:DibujosManager
     * @description
     * Inicializa el canvas y establece funciones para eventos, e inicializa los valores de los atributos
     * 'usernameUsuario' y 'sala'.
     *
     * @param {String} username Nombre de usuario del usuario.
     * @param {String} salaParam ID de la sala.
     *
     **/
    this.inicializar = function (usernameParam, salaParam) {
        canvas = new fabric.Canvas('area-dibujo');
        canvas.selection = false;

        canvas.on('mouse:up', function (options) {
            if (canvas.isDrawingMode) {

                var numObjetos = canvas.getObjects().length - 1;

                var figura = {
                    tipo: 'path',
                    datos: canvas.getObjects()[numObjetos]
                }

                figura.datos.id = new Date().getTime();

                mensaje = {
                    figura: figura,
                    accion: 'add',
                    idFiguraOriginal: figura.datos.id
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

        usernameUsuario = usernameParam;
        sala = salaParam;
    }

    /**
     * @ngdoc method
     * @name addCirculo
     * @methodOf copernicus.function:DibujosManager
     * @description
     * Añade un circulo al canvas y lo comunica al resto de usuarios conectados al servicio a través de 'sendData'.
     *
     **/
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

    /**
     * @ngdoc method
     * @name addRectangulo
     * @methodOf copernicus.function:DibujosManager
     * @description
     * Añade un rectangulo al canvas y lo comunica al resto de usuarios conectados al servicio a través de 'sendData'.
     *
     **/
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

    /**
     * @ngdoc method
     * @name addTriangulo
     * @methodOf copernicus.function:DibujosManager
     * @description
     * Añade un triangulo al canvas y lo comunica al resto de usuarios conectados al servicio a través de 'sendData'.
     *
     **/
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

    /**
     * @ngdoc method
     * @name dibujar
     * @methodOf copernicus.function:DibujosManager
     * @description
     * Establece el canvas en modo dibujo.
     *
     **/
    this.dibujar = function () {
        canvas.isDrawingMode = true;
    };

    /**
     * @ngdoc method
     * @name seleccionar
     * @methodOf copernicus.function:DibujosManager
     * @description
     * Establece el canvas en modo seleccionar.
     *
     **/
    this.seleccionar = function () {
        canvas.isDrawingMode = false;
    };

    /**
     * @ngdoc method
     * @name borrar
     * @methodOf copernicus.function:DibujosManager
     * @description
     * Borra todo el contenido del canvas.
     *
     **/
    this.borrar = function () {
        var mensaje = {
            accion: 'clear'
        }
        sendData(mensaje);
        this.accion(mensaje);
    };

    /**
     * @ngdoc method
     * @name accion
     * @methodOf copernicus.function:DibujosManager
     * @description
     * Recibe una acción realizada por otro usuario sobre el canvas.
     *
     * @param {object} mensaje Mensaje que contiene la acción realizada por el otro usuario.
     *
     **/
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

    /**
     * @ngdoc method
     * @name removeFigura
     * @methodOf copernicus.function:DibujosManager
     * @description
     * Borra una figura del canvas. Este método es utilizado para simular el movimiento de una figura en tiempo real
     * en el canvas de los otros usuarios.
     *
     * @param {object} mensaje Mensaje que contiene la información de la figura a borrar.
     *
     **/
    function removeFigura(mensaje) {

        var objects = canvas.getObjects();

        for (var i = 0, len = canvas.getObjects().length; i < len; i++) {

            if (objects[i] != undefined && objects[i]['id'] == mensaje.figura.idFiguraOriginal) {
                canvas.remove(objects[i]);
            }
        }

    }

    /**
     * @ngdoc method
     * @name addFigura
     * @methodOf copernicus.function:DibujosManager
     * @description
     * Añade una figura al canvas.
     *
     * @param {object} mensaje Mensaje que contiene la información de la figura a añadir.
     *
     **/
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

            case 'path':
                var dibujo = mensaje.figura.datos;

                var figura = new fabric.Path();

                figura.id = mensaje.idFiguraOriginal;

                //Copiamos los valores del dibujo que acabamos de hacer
                // en el dibujo que se va a mostrar al usuario
                for (var n in dibujo) figura[n] = dibujo[n];

                break;
        }
        if (canvas)
            canvas.add(figura);

    }

    /**
     * @ngdoc method
     * @name sendData
     * @methodOf copernicus.function:DibujosManager
     * @description
     * Envía una acción realizada sobre el canvas al resto de usuario conectados al servicio a través del servidor
     * de WebSockets.
     *
     * @param {object} mensaje Mensaje que contiene la información de la acción realizada.
     *
     **/
    function sendData(mensaje) {

        var figura = mensaje.figura;

        ws.send(JSON.stringify(
            {
                'seccion': 'dibujos',
                'data': {
                    'username': usernameUsuario,
                    'sala': sala,
                    'figura': figura,
                    'idFiguraOriginal': mensaje.idFiguraOriginal,
                    'accion': mensaje.accion
                }

            }));
    }

}