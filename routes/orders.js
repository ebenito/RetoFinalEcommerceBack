const router = require('express').Router();
const OrderController = require('../Controllers/OrderController');

router.post('/nuevo', OrderController.insert)
router.post('/pagado', OrderController.updOrderPayed)
router.post('/enviado', OrderController.updOrderSended)


router.get('/info/:id', OrderController.getOrderInfo);
router.get('/cliente/:id', OrderController.getOrdersByUserId);

module.exports = router;