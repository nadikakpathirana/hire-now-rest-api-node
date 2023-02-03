const express = require('express');
const router = express.Router();

const authUser = require("../middleware/auth-user");

const FavouriteController = require("../controllers/favourite-controllers");

// favourite services of a buyer
router.get('/seller-orders/:buyerID', FavouriteController.get_favourites_of_a_buyer);

// add a favourite service
router.post('/', FavouriteController.add_new_favourite);

// delete a favourite
router.delete('/:favouriteID', FavouriteController.remove_favourite);

module.exports = router;