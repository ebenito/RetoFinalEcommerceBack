const router = require('express').Router();
const ProductController = require('../Controllers/ProductController');

const checkRol = require('../middleware/checkRol');

router.get('/listado', ProductController.getAll)
router.post('/inserta', ProductController.insert)
router.put('/:id', ProductController.update)
router.delete('/:id', ProductController.delete)


router.get('/vendedor/:id', ProductController.getAllByVendor);

module.exports = router;