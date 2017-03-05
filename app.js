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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public', express.static('public'));
app.use(favicon(path.join(__dirname, 'public','favicon.ico')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use('/api',routesApi);
app.use('/', routesServer);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Página no encontrada - Error ');
  err.status = 404;
  err.reason = "Parece que te has perdido...";
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = require('./server/servers/http.js')(app);
require('./server/servers/websockets')(server);