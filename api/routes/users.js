const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const authUser = require("../middleware/auth-user")


const UserController = require("../controllers/user-controller");


// get all users
router.get('/', UserController.get_all_users);

// get user counts
router.get('/platform-status', UserController.get_user_counts);

// get all sellers
router.get('/sellers', UserController.get_sellers);

// register a user
router.post('/signup', UserController.register_new_user);

// user login
router.post('/get-token', UserController.get_user_token);

// check validity of a user
router.post('/check-token', authUser,  UserController.check_is_valid_token);

// get user info
router.get('/:userID', UserController.get_user_info);

// update user info
router.patch('/:userID', UserController.update_user_info);

// remove a user
router.delete('/:userID', UserController.remove_a_user);


module.exports = router;