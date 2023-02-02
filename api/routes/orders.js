const express = require('express');
const router = express.Router();

const authUser = require("../middleware/auth-user");

const OrderController = require("../controllers/order-controllers");

// orders of a seller
router.get('/seller-orders/:sellerID', OrderController.get_orders_of_a_seller);

// orders of a buyer
router.get('/buyer-orders/:buyerID', OrderController.get_orders_of_a_buyer);

// get a specific order
router.get('/:orderID', OrderController.get_specific_order);

// create a order
router.post('/', authUser, OrderController.create_a_order);

// update a order
router.patch('/:orderID', authUser, OrderController.patch_a_order);

// delete a order
router.delete('/:orderID', OrderController.patch_a_order);

module.exports = router;