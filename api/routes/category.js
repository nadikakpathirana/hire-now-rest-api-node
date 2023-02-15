const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
// var shell = require('shelljs');

const CategoryController = require("../controllers/category-controllers");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdir('./uploads/',(err)=>{
            cb(null, './uploads/');
        });
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const fPath = './static/images';
//         if (!fs.existsSync(fPath)){
//             shell.mkdir('-p', fPath);
//         }
//         cb(null, fPath);
//     },
//
//     filename: function (req, file, cb) {
//         cb(null, `${new Date().toString()}-${file.originalname}`)
//     }
// })

// const fileFilter = (req, file, cb) => {
//     // reject file
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }

const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    // fileFilter: fileFilter
});

// const upload = multer({
//     dest: 'static/images/categories/'
// });




// get all categories
router.get('/', CategoryController.get_all_category);

// get a specific category
router.get('/:categoryID', CategoryController.get_specific_category);

// create a category
router.post('/', upload.single('image'), CategoryController.create_category);

// update a category
router.patch('/:categoryID', CategoryController.update_category);

// delete a category
router.delete('/:categoryID', CategoryController.remove_category);

module.exports = router;