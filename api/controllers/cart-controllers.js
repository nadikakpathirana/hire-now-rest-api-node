const mongoose = require("mongoose");

const Cart = require("../models/cart");

function calculate_age(dob) {
    try {
        var diff_ms = Date.now() - dob.getTime();
        var age_dt = new Date(diff_ms);
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    } catch (e) {
        return 24
    }

}

// get cart list of a buyer
exports.get_cart_items_of_a_buyer = (req, res, next) => {
    const buyerID = req.params.buyerID;
    Cart.find({"buyerID": buyerID}).populate('service').populate('seller')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    cartItems: docs.map((doc) => {
                        return {
                            _id: doc._id,
                            service: {
                                service: {
                                    _id: doc.service._id,
                                    title: doc.service.title,
                                    serviceImg: doc.service.serviceImg,
                                    description: doc.service.description,
                                    rateOfPayment: doc.service.rateOfPayment,
                                    price: doc.service.price,
                                    // category: doc.service.category,
                                    rating: 5
                                },
                                seller: {
                                    _id: doc.seller._id,
                                    name: doc.seller.username,
                                    proPic: doc.seller.proPic,
                                    job: doc.seller.job,
                                    availability: doc.seller.availability,
                                    city: doc.seller.location,
                                    age: calculate_age(doc.dob),
                                    rating: 6,
                                }
                            }
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
        service: req.body.service,
        seller: req.body.seller,
    })
    cart
        .save()
        .then(result => {
            res.status(201).json({
                message: "cart_created",
                createdCartItem: {
                    _id: result._id,
                    buyer: result.buyer,
                    service: result.service,
                    seller: result.seller
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

exports.remove_all_cart_item = (req, res, next) => {
    const ids = req.body.cartIds;
    Cart.deleteMany({ _id: { $in: ids } })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "all_cart_deleted",
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}