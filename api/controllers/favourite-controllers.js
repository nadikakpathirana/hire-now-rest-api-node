const mongoose = require("mongoose");

const Favourite = require("../models/favourite");

// get favourites list of a buyer
exports.get_favourites_of_a_buyer = (req, res, next) => {
    const buyerID = req.params.buyerID;
    Favourite.find({"buyerID": buyerID}).populate('serviceID')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    services: docs.service
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
}

exports.add_new_favourite = (req, res, next) => {
    const favourite = new Favourite({
        _id: new mongoose.Types.ObjectId(),
        buyer: req.body.buyer,
        service: req.body.service
    })
    favourite
        .save()
        .then(result => {
            res.status(201).json({
                message: "favourite_created",
                createdOrder: {
                    name: result.buyer,
                    service: result.service,
                    _id: result._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
}

exports.remove_favourite = (req, res, next) => {
    const id = req.params.favouriteID;
    Favourite.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "favourite_deleted",
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}