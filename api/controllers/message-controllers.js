const Message = require("../models/message");
const mongoose = require("mongoose");


exports.messages_of_specific_sender_and_receiver = (req, res, next) => {
    var buyer = req.params.buyer;
    var seller = req.params.seller;
    Message.find({buyer:buyer, seller: seller})
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    messages: docs.map( doc => {
                        return {
                            content: doc.content,
                            buyer: doc.buyer,
                            seller: doc.seller,
                            timestamp: doc.timestamp,
                            _id: doc._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'message_empty'});
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_specific_message = (req, res, next) => {
    const id = req.params.messageID;
    Message.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    message: doc,
                });
            } else {
                res.status(404).json({message: 'message_empty'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        })
}

exports.create_message = (req, res, next) => {
    const message = new Message({
        _id: new mongoose.Types.ObjectId(),
        content: req.body.content,
        buyer: req.body.buyer,
        seller: req.body.seller,
        timestamp: req.body.timestamp
    })
    message.save()
        .then(result => {
            res.status(201).json({
                message: "message_created",
                createdMessage: {
                    _id: result._id,
                    content: result.content,
                    buyer: result.buyer,
                    seller: result.seller,
                    timestamp: result.timestamp,
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
}