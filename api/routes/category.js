const express = require('express');
const router = express.Router();

const CategoryController = require("../controllers/category-controllers");

// get all categories
router.get('/', CategoryController.get_all_category);

// get a specific category
router.get('/:categoryID', CategoryController.get_specific_category);

// create a category
router.post('/', CategoryController.create_category);

// update a category
router.patch('/:categoryID', CategoryController.update_category);

// delete a category
router.delete('/:categoryID', CategoryController.remove_category);

module.exports = router;