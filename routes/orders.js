const router = require('express').Router();
const OrderController = require('../Controllers/OrderController');

router.post('/nuevo', OrderController.insert)

module.exports = router;