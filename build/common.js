// see http://vuejs-templates.github.io/webpack for documentation.
var path     = require('path')
var express  = require('express')
var logger   = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app      = express ()
const rewrite = require('express-urlrewrite')

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.query());


module.exports = {
	app:app,
  express:express,
  rewrite:rewrite
}
