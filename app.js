if (process.env.NODE_ENV != 'production') {
    require('dotenv').load();
}

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./server/routes/index');
var routesServer = require('./server/routes/routes');
var routesApi = require('./api/routes/routes');

var app = express();

app.use(bodyParser.json({ limit: '50mb', extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public', express.static('public'));
app.use('/modulos', express.static('views/modulos'));
app.use('/dialogs', express.static('views/dialogs'));

app.use(favicon(path.join(__dirname, 'public','favicon.ico')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/bootstrap', express.static(__dirname + '/bower_components/bootstrap/dist/'));
app.use('/gridstack', express.static(__dirname + '/bower_components/gridstack/dist/'));
app.use('/angular-translate', express.static(__dirname + '/bower_components/angular-translate/'));
app.use('/translate-storage', express.static(__dirname + '/bower_components/angular-translate-storage-cookie/'));
app.use('/knockout', express.static(__dirname + '/bower_components/knockout/dist/'));
app.use('/lodash', express.static(__dirname + '/bower_components/lodash/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/jquery-ui', express.static(__dirname + '/bower_components/jquery-ui/'));
app.use('/websocket', express.static(__dirname + '/bower_components/angular-websocket/dist/'));
app.use('/angularAnimate', express.static(__dirname + '/bower_components/angular-animate/'));
app.use('/angularAria', express.static(__dirname + '/bower_components/angular-aria/'));
app.use('/angularMaterial', express.static(__dirname + '/bower_components/angular-material/'));
app.use('/angucomplete', express.static(__dirname + '/bower_components/angucomplete/'));
app.use('/reveal.js', express.static(__dirname + '/bower_components/reveal.js/'));
app.use('/ng-file-upload', express.static(__dirname + '/bower_components/ng-file-upload/'));
app.use('/ng-img-crop', express.static(__dirname + '/bower_components/ng-img-crop/compile/minified'));
app.use('/growl', express.static(__dirname + '/bower_components/angular-growl-v2/build'));
app.use('/font-awesome', express.static(__dirname + '/bower_components/font-awesome'));
app.use('/fabric.js', express.static(__dirname + '/bower_components/fabric.js/dist'));
app.use('/videogular', express.static(__dirname + '/bower_components/videogular'));
app.use('/videogular-controls', express.static(__dirname + '/bower_components/videogular-controls'));
app.use('/videogular-youtube', express.static(__dirname + '/bower_components/bower-videogular-youtube'));
app.use('/videogular-themes', express.static(__dirname + '/bower_components/videogular-themes-default'));
app.use('/angular-sanitize', express.static(__dirname + '/bower_components/angular-sanitize'));
app.use('/videogular-overlay-play', express.static(__dirname + '/bower_components/videogular-overlay-play'));
app.use('/videogular-buffering', express.static(__dirname + '/bower_components/videogular-buffering'));

app.use('/api',routesApi);
app.use('/', routesServer);

app.use(function(req, res, next) {
  var err = new Error('Página no encontrada - Error ');
  err.status = 404;
  err.reason = "Parece que te has perdido...";
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

var server = require('./server/servers/http.js')(app);
require('./server/servers/websockets')(server);

