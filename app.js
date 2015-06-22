var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var home = require('./routes/home');
var morgan = require('morgan');

var app = express(),
    server;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/'), { redirect : false }));
app.use(cookieParser());
app.use(morgan('dev'));
// app.get('/', function(req, res, next) {
//     next();
// });
app.all('*', home);


module.exports = app;
