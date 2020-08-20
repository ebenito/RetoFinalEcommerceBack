var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { tematica: 'backend' });
});

router.get('/registro', function(req, res, next) {
  res.render('registro');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

module.exports = router;
