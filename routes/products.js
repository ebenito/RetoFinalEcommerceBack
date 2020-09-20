const router = require('express').Router();
const ProductController = require('../Controllers/ProductController');

const checkRol = require('../middleware/checkRol');

router.get('/listado', ProductController.getAll);
router.post('/inserta', ProductController.insert);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

router.get('/segunventas', ProductController.getProductSortedByOrdersQty);
router.get('/porpreciomenor', ProductController.getProductSortedBySmallerPrice);
router.get('/porpreciomayor', ProductController.getProductSortedByBiggerPrice);
router.get('/pornombre', ProductController.getProductSortedByName);

router.get('/vendedor/:id', ProductController.getAllByVendor);
router.get('/categoria/:id', ProductController.getAllByCategory);
router.get('/nombre/:id', ProductController.getNameProductSync);

module.exports = router;