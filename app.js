require('./config/mongoose');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authenticate = require('./middleware/authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
var ordersRouter = require('./routes/orders');
var invoicesRouter = require('./routes/invoice');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/set', (req, res) => {
//   // https://web.dev/samesite-cookie-recipes/#handling-incompatible-clients
//   res.cookie('geekshubsacademy.com', 'geekshubsacademy.com', { sameSite: 'none', secure: true });
//   res.end();
// });

app.use('/', indexRouter);

app.get('/auth', authenticate, (req, res) => {
  res.send({ user: req.user, message: 'Estas autorizado' })
})

app.use('/users', usersRouter);
app.use('/productos', productsRouter);
app.use('/categorias', categoriesRouter);
app.use('/pedidos', ordersRouter);
app.use('/factura', invoicesRouter);

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

// const sendgrid = require("./helpers/sendgrid");
// sendgrid.EnviarFactura("esteban.benito@gmail.com");
// if (sendgrid.resultado == "OK")
// {
//     console.log("correo enviado");
// }

module.exports = app;
