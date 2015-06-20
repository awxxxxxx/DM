var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var home = require('./routes/home');
//var categories = require('./routes/categories');

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

app.get('/', function(req, res, next) {
    res.redirect('/home');
});
app.get('/home', home);

server = app.listen(3000);
console.log('server start on http://localhost:' + server.address().port + '/home');
console.log('Listening on port %d', server.address().port);

//module.exports = app;