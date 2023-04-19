var createError = require('http-errors');
var express = require('express');
const hbs = require( 'express-handlebars')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session")
var { v4:uuidv4 } = require("uuid")
var validator = require("express-validator")
var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let user = require('./routes/user');
let admin = require('./routes/crudBuilder/admin');
let sales = require('./routes/crudBuilder/sales');
let salon = require('./routes/crudBuilder/salon');
let hairType = require('./routes/crudBuilder/hairType');
let hairSubCategory = require('./routes/crudBuilder/hairSubCategory');
let hairCategory = require('./routes/crudBuilder/hairCategory');
let service = require('./routes/crudBuilder/service');
let serviceCategory = require('./routes/crudBuilder/serviceCategory');
let buisness = require('./routes/crudBuilder/buisness');
let userss = require('./routes/crudBuilder/user');
let storage = require('./routes/fileUpload/storage');
let test = require('./routes/fileUpload/test');
let api = require('./routes/Api/index');
let onBoarding = require('./routes/Api/onboarding');

require('dotenv').config();

var app = express();

app.engine( 'hbs', hbs.engine( { 
  defaultLayout: 'main', 
  extname: '.hbs', 
} ) );

app.set("view engine", "hbs");

app.use(session({
  secret: uuidv4(),
  resave: false,
  saveUninitialized: true
}))

app.use(logger('dev'));
app.use(validator());
// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(express.static('public'));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/user',user);
app.use('/users', usersRouter);

app.use('/admin', admin);
app.use('/onBoarding',onBoarding);
app.use('/sales', sales);
app.use('/salon', salon);
app.use('/hairType', hairType);
app.use('/hairSubCategory', hairSubCategory);
app.use('/hairCategory', hairCategory);
app.use('/serviceCategory', serviceCategory);
app.use('/service', service);
app.use('/business', buisness);
app.use('/userss', userss);
app.use('/imgUpload', storage);
app.use('/test',test)
app.use('/api',api)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

// creating server
const port = process.env.PORT || 3000;
app.listen( port, () => console.log(`Server listening on http://localhost:${port}` ))

module.exports = app;
