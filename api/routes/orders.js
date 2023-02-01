const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const authUser = require("../middleware/auth-user");

const Order = require('../models/order');

// orders of a seller
router.get('/seller-orders/:sellerID', (req, res, next) => {
    const sellerID = req.params.sellerID;
    Order.find({"seller": sellerID})
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    orders: docs.map( doc => {
                        return {
                            buyer: doc.buyer,
                            seller: doc.seller,
                            service: doc.service,
                            status: doc.status,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orders/' + doc._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'order_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});


// orders of a buyer
router.get('/buyer-orders/:buyerID', (req, res, next) => {
    const buyerID = req.params.buyerID;
    Order.find({"buyer": buyerID})
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    orders: docs.map( doc => {
                        return {
                            buyer: doc.buyer,
                            seller: doc.seller,
                            service: doc.service,
                            status: doc.status,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orders/' + doc._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'order_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

// get a specific order
router.get('/:orderID', (req, res, next) => {
    const id = req.params.orderID;
    Order.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    order: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                });
            } else {
                res.status(404).json({message: 'order_empty'})
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
})

//create a order
router.post('/', authUser, (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        buyer: req.body.buyer,
        seller: req.body.seller,
        service: req.body.service,
        status: req.body.status
    })

    order.save()
        .then(result => {
            res.status(201).json({
                message: "order_created",
                createdOrder: {
                    name: result.name,
                    title: result.title,
                    description: result.description,
                    category: result.category,
                    provider: result.provider,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
});


//update a order
router.patch('/:orderID', authUser, (req, res, next) => {
    const id = req.params.orderID;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Order.update({_id:id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "order_updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + id
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
})

router.delete('/:orderID', (req, res, next) => {
    const id = req.params.orderID;
    Order.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "order_deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/services/',
                    body: {
                        buyer: 'ObjectId',
                        seller: 'ObjectId',
                        service: 'ObjectId',
                        status: 'ObjectId'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
})

module.exports = router;