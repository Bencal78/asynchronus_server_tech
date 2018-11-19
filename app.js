//Require express and create an instance of it
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var users = require('./lib/user/route');
app.use('/hello', users);

module.exports = app;
