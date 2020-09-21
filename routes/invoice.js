const router = require('express').Router();
const InvoiceController = require('../Controllers/InvoiceController');

router.post('/nueva', InvoiceController.insert)

router.get('/:id', InvoiceController.getInvoiceInfo)
router.put('/modificar/:id', InvoiceController.updInvoice)

module.exports = router;