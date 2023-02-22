const Order = require("../models/order");
const mongoose = require("mongoose");


exports.get_orders_of_a_seller = (req, res, next) => {
    const sellerID = req.params.sellerID;
    Order.find({"seller": sellerID}).populate('service').populate('buyer')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    orders: docs.map( doc => {
                        return {
                            name: doc.buyer.username,
                            proPic: doc.buyer.proPic,
                            serviceImg: doc.service.serviceImg,
                            title: doc.service.title,
                            about: doc.service.about,
                            price: doc.service.price,
                            status: doc.status,
                            message: doc.message,
                            _id: doc._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({error: 'order_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_pending_orders_of_a_seller = (req, res, next) => {
    const sellerID = req.params.sellerID;
    Order.find({seller: sellerID, status: "pending"}).populate('service').populate('buyer')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    orders: docs.map( doc => {
                        return {
                            name: doc.buyer.username,
                            proPic: doc.buyer.proPic,
                            serviceImg: doc.service.serviceImg,
                            title: doc.service.title,
                            about: doc.service.about,
                            price: doc.service.price,
                            status: doc.status,
                            message: doc.message,
                            _id: doc._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({error: 'order_empty'});
            }

        })
        .catch(err => {
            console.log(err, "error");
            res.status(500).json({
                error: err
            })
        })
}

exports.get_active_orders_of_a_seller = (req, res, next) => {
    const sellerID = req.params.sellerID;
    Order.find({seller: sellerID, status: "active"}).populate('service').populate('buyer')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    orders: docs.map( doc => {
                        return {
                            name: doc.buyer.username,
                            proPic: doc.buyer.proPic,
                            serviceImg: doc.service.serviceImg,
                            title: doc.service.title,
                            about: doc.service.about,
                            price: doc.service.price,
                            status: doc.status,
                            message: doc.message,
                            _id: doc._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({error: 'order_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_completed_orders_of_a_seller = (req, res, next) => {
    const sellerID = req.params.sellerID;
    Order.find({seller: sellerID, status: "completed"}).populate('service').populate('buyer')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    orders: docs.map( doc => {
                        return {
                            name: doc.buyer.username,
                            proPic: doc.buyer.proPic,
                            serviceImg: doc.service.serviceImg,
                            title: doc.service.title,
                            about: doc.service.about,
                            price: doc.service.price,
                            status: doc.status,
                            message: doc.message,
                            _id: doc._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({error: 'order_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_orders_of_a_buyer = (req, res, next) => {
    const buyerID = req.params.buyerID;
    Order.find({"buyer": buyerID}).populate('service').populate('seller')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    orders: docs.map( doc => {
                        return {
                            name: doc.seller.username,
                            proPic: doc.seller.proPic,
                            buyer: doc.buyer,
                            serviceImg: doc.service.serviceImg,
                            title: doc.service.title,
                            about: doc.service.about,
                            price: doc.service.price,
                            status: doc.status,
                            message: doc.message,
                            _id: doc._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({error: 'order_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_pending_orders_of_a_buyer = (req, res, next) => {
    const buyerID = req.params.buyerID;
    Order.find({buyer: buyerID, status: "pending"}).populate('service').populate('seller')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    orders: docs.map( doc => {
                        return {
                            name: doc.seller.username,
                            proPic: doc.seller.proPic,
                            buyer: doc.buyer,
                            serviceImg: doc.service.serviceImg,
                            title: doc.service.title,
                            about: doc.service.about,
                            price: doc.service.price,
                            status: doc.status,
                            message: doc.message,
                            _id: doc._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({error: 'order_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


exports.get_active_orders_of_a_buyer = (req, res, next) => {
    const buyerID = req.params.buyerID;
    // Order.find({buyer: buyerID, {$or: {[{status: "active"},{status: "completed"}]}} , paid: false})
    Order.find({
        $and: [
            {
                buyer: buyerID
            },
            {
                $or: [
                    {status: "active"},
                    {status: "completed"}
                ]
            },
            {
                paid: false
            }
        ]
    }).populate('service').populate('seller')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    orders: docs.map( doc => {
                        return {
                            name: doc.seller.username,
                            proPic: doc.seller.proPic,
                            buyer: doc.buyer,
                            serviceImg: doc.service.serviceImg,
                            title: doc.service.title,
                            about: doc.service.about,
                            price: doc.service.price,
                            status: doc.status,
                            message: doc.message,
                            _id: doc._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({error: 'order_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_completed_orders_of_a_buyer = (req, res, next) => {
    const buyerID = req.params.buyerID;
    Order.find({buyer: buyerID, status: "completed", paid: true}).populate('service').populate('seller')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    orders: docs.map( doc => {
                        return {
                            name: doc.seller.username,
                            proPic: doc.seller.proPic,
                            buyer: doc.buyer,
                            serviceImg: doc.service.serviceImg,
                            title: doc.service.title,
                            about: doc.service.about,
                            price: doc.service.price,
                            status: doc.status,
                            message: doc.message,
                            _id: doc._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({error: 'order_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_specific_order = (req, res, next) => {
    const id = req.params.orderID;
    Order.findById(id).populate('service')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    _id: doc._id,
                    serviceImg: doc.service.serviceImg,
                    title: doc.service.title,
                    about: doc.service.about,
                    message: doc.message,
                });
            } else {
                res.status(404).json({message: 'order_empty'})
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
}

exports.create_a_order = (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        buyer: req.body.buyerId,
        seller: req.body.sellerId,
        service: req.body.serviceId,
        message: req.body.message,
        status: "pending"
    })
    order
        .save()
        .then(result => {
            res.status(201).json({
                message: "order_created",
                status: true
            })
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({status: false})
        })
}

exports.patch_a_order = (req, res, next) => {
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
}

exports.remove_a_order = (req, res, next) => {
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
}

