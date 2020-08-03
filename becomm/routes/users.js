var express = require('express');
var router = express.Router();
const UserController = require('../Controllers/UserController');

router.get('/', UserController.getAll);
router.post('/', UserController.registerAsync);

module.exports = router;
