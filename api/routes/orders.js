const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('./../models/order')
const Product = require('../models/products');

router.get('/', (req, res, next) => {
    Order.find()
        // .select('product quantity _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        seller: doc.seller,
                        buyer: doc.buyer,
                        status: doc.status,
                        request: {
                            type: 'GET',
                            url: 'http://localhost/orders/' + doc._id
                        }
                    }
                }),

            });

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res, next) => {
    Product.findById(req.body.productID)
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        seller: req.body.seller,
        buyer: req.body.buyer,
        status: req.body.status
    });
    order
        .save()
        .then(result => {
            res.status(201).json({
                message: "Order Created",
                createdOrder: {
                    _id: result._id,
                    seller: req.body.seller,
                    buyer: req.body.buyer,
                    status: req.body.status
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.get('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    })
})

router.patch('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Order patched',
        orderId: req.params.orderId
    })
})

router.delete('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted'
    })
})

module.exports = router;