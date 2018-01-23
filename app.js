var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');

var basicAuth = require('basic-auth-connect');
var index = require('./routes/index');
var list_dir = require('./routes/list_dir');

var app = express();

app.set('port', 8080);
app.use(basicAuth("sayan", "abcd"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', list_dir);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({});
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server started on port ' + app.get('port') + '...');
});

module.exports = app;
