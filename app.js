var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// <--------------database---------------->
var dblogin = process.env.DBLOGIN || 'putyomrf';
var dbpassword = process.env.DBPASS || 'empty';

var Sequelize = require('sequelize');
var sequelize = new Sequelize('putyomrf', dblogin, dbpassword,
    {dialect: "sqlite", storage: 'database.sqlite'});
// <--------------database---------------->

var routes = require('./routes/index');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;

