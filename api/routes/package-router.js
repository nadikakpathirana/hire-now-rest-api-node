const express = require('express');
const router = express.Router();

const PackageController = require("../controllers/package-controllers");

// packages of a seller
router.get('/seller-packages/:sellerID', PackageController.get_packages_of_a_seller);

// get a specific package
router.get('/:packageID', PackageController.get_specific_package);

// create a package
router.post('/', PackageController.create_a_package);

// update a order
router.patch('/:packageID', PackageController.update_a_package);

// delete a order
router.delete('/:packageID', PackageController.remove_a_package);

module.exports = router;