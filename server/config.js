var config = {};

//Si existe la variable de entorno HTTP_PORT, se utiliza el puerto que contiene. Si no se utiliza la variable PORT.
//Si no existe ninguna de estas se utiliza el puerto 8080
config.port = process.env.HTTP_PORT || process.env.PORT || 8080;

module.exports = config;