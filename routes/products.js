const router = require('express').Router();
const ProductController = require('../Controllers/ProductController');

router.get('/listado', ProductController.getAll)
router.post('/inserta', ProductController.insert)
router.put('/:id', ProductController.update)
router.delete('/:id', ProductController.delete)

module.exports = router;