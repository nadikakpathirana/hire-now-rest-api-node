const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdir('./uploads/images/gallery/',(err)=>{
            cb(null, './uploads/images/gallery/');
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


const GalleryController = require("../controllers/gallery-controllers");


// get all services
router.get('/:sellerID', GalleryController.get_all_of_seller);

// create a gallery record
router.post('/', upload.single('img'), GalleryController.add_new_image);

module.exports = router;