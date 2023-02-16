const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');

// const authUser = require("../middleware/auth-user")

const ServiceController = require("../controllers/service-controllers");




const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdir('./uploads/images/services/',(err)=>{
            cb(null, './uploads/images/services/');
        });
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

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
router.post('/', upload.single('serviceImg'),  ServiceController.create_a_service);

// update a service
router.patch('/:serviceID', upload.single('serviceImg'), ServiceController.update_a_service);

// remove a service
router.delete('/:serviceID', ServiceController.remove_a_service);


module.exports = router;