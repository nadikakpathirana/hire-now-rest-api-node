const mongoose = require("mongoose");

const Cart = require("../models/cart");

// get cart list of a buyer
exports.get_cart_items_of_a_buyer = (req, res, next) => {
    const buyerID = req.params.buyerID;
    Cart.find({"buyerID": buyerID}).populate('service')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    cartItems: docs.map((doc) => {
                        return {
                            _id: doc._id,
                            buyer: doc.buyer,
                            title:doc.service.title,
                            serviceImg:doc.service.serviceImg,
                            description:doc.service.description,
                            rateOfPayment:doc.service.rateOfPayment,
                            price:doc.service.price,
                            rating: 5

                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({status: false, error: 'cart_empty'});
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.add_new_cart_item = (req, res, next) => {
    const cart = new Cart({
        _id: new mongoose.Types.ObjectId(),
        buyer: req.body.buyer,
        service: req.body.service
    })
    cart
        .save()
        .then(result => {
            res.status(201).json({
                message: "cart_created",
                createdCartItem: {
                    _id: result._id,
                    buyer: result.buyer,
                    service: result.service
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
}

exports.remove_cart_item = (req, res, next) => {
    const id = req.params.cartID;
    Cart.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "cart_deleted",
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}