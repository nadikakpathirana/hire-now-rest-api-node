const express = require('express');
const router = express.Router();

// const authUser = require("../middleware/auth-user");

const OrderController = require("../controllers/order-controllers");

// orders of a seller
router.get('/seller-orders/:sellerID', OrderController.get_orders_of_a_seller);

// pending orders of a seller
router.get('/seller-pending-orders/:sellerID', OrderController.get_pending_orders_of_a_seller);

// active  orders of a seller
router.get('/seller-active-orders/:sellerID', OrderController.get_active_orders_of_a_seller);

// completed orders of a seller
router.get('/seller-completed-orders/:sellerID', OrderController.get_completed_orders_of_a_seller);


// orders of a buyer
router.get('/buyer-orders/:buyerID', OrderController.get_orders_of_a_buyer);

// pending orders of a buyer
router.get('/buyer-pending-orders/:buyerID', OrderController.get_pending_orders_of_a_buyer);

// active orders of a buyer
router.get('/buyer-active-orders/:buyerID', OrderController.get_active_orders_of_a_buyer);

//completed orders of a buyer
router.get('/buyer-completed-orders/:buyerID', OrderController.get_completed_orders_of_a_buyer);



// get a specific order
router.get('/:orderID', OrderController.get_specific_order);

// create a order
router.post('/', OrderController.create_a_order);

// update a order
router.patch('/:orderID', OrderController.patch_a_order);

// delete a order
router.delete('/:orderID', OrderController.remove_a_order);

module.exports = router;