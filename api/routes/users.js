const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const UserController = require("../controllers/user-controller");


// get all users
router.get('/', UserController.get_all_users);

// register a user
router.post('/signup', UserController.register_new_user);

// user login
router.post('/get-token', UserController.get_user_token);

// get user info
router.get('/:userID', UserController.get_user_info);

// update user info
router.patch('/:userID', UserController.update_user_info);

// remove a user
router.delete('/:userID', UserController.remove_a_user);


module.exports = router;