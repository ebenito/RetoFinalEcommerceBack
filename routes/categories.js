const router = require('express').Router();
const CategoryController = require('../Controllers/CategoryController');

router.get('/listado', CategoryController.getAll)
router.post('/inserta', CategoryController.insert)
router.put('/:id', CategoryController.update)
router.delete('/:id', CategoryController.delete)

module.exports = router;