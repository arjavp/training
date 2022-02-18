const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');
const orderController = require('../controller/orders');

const Order = require('../models/order');
const prodetails = require('../models/products');
const checkAuth = require('../middleware/check-auth')

router.get('/',checkAuth, orderController.ordres_get_all);


router.post('/',checkAuth, orderController.orders_create_order);

router.get('/:orderId', checkAuth, orderController.orders_getone_order);


router.delete('/:orderId', checkAuth,orderController.orders_delete_order);


module.exports = router;