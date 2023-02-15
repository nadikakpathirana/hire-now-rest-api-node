const express = require('express');
const router = express.Router();


const authUser = require("../middleware/auth-user")


const GalleryController = require("../controllers/gallery-controllers");


// get all services
router.get('/:sellerID', GalleryController.get_all_of_seller);

// create a gallery record
router.post('/', GalleryController.add_new_image);

module.exports = router;