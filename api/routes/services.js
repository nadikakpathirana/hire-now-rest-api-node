const express = require('express');
const router = express.Router();


const authUser = require("../middleware/auth-user")


const ServiceController = require("../controllers/service-controllers");


// get all services
router.get('/', ServiceController.get_all_services);

// get a specific service
router.get('/:serviceID', ServiceController.create_a_service);

// create a service
router.post('/', authUser, ServiceController.create_a_service);

// update a service
router.patch('/:serviceID', authUser, ServiceController.update_a_service);

// remove a service
router.delete('/:serviceID', ServiceController.remove_a_service);


module.exports = router;