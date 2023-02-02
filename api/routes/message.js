const express = require('express');
const router = express.Router();


const MessageController = require("../controllers/message-controllers");


// get all messages of specific sender and receiver
router.get('/:buyerID/:sellerID', MessageController.messages_of_specific_sender_and_receiver);

// get a specific message
router.get('/:messageID', MessageController.get_specific_message);

// create a message
router.post('/', MessageController.create_message);

module.exports = router;