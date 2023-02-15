const express = require('express');
const router = express.Router();


const authUser = require("../middleware/auth-user")


const ServiceController = require("../controllers/service-controllers");


// get all services
router.get('/', ServiceController.get_all_services);

// get all services of a seller
router.get('/seller-services/:sellerID', ServiceController.get_all_services_of_a_seller);

// get suggested services
router.get('/suggested', ServiceController.get_suggested_services);

// get suggested services
router.get('/popular', ServiceController.get_popular_services);

// get a specific service
router.get('/:serviceID', ServiceController.get_specific_service);

// create a service
router.post('/', authUser, ServiceController.create_a_service);

// update a service
router.patch('/:serviceID', authUser, ServiceController.update_a_service);

// remove a service
router.delete('/:serviceID', ServiceController.remove_a_service);


module.exports = router;