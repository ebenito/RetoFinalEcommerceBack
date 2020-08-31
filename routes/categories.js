const router = require('express').Router();
const CategoryController = require('../Controllers/CategoryController');

router.post('/inserta', CategoryController.insert)

module.exports = router;