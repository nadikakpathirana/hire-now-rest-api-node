const mongoose = require("mongoose");

const Review = require("../models/review");

// get cart list of a buyer
exports.get_reviews_of_a_service = (req, res, next) => {
    const serviceID = req.params.serviceID;
    Review.find({"service": serviceID}).populate('buyer')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    reviewItems: docs.map((doc) => {
                        return {
                            _id: doc._id,
                            name: doc.buyer.username,
                            proPic: doc.buyer.proPic,
                            rating: doc.rating,
                            review: doc.review,
                            date: new Date(doc.timestamp).toDateString()

                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({status: false, error: 'review_empty'});
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.add_new_review = (req, res, next) => {
    const review = new Review({
        _id: new mongoose.Types.ObjectId(),
        buyer: req.body.buyer,
        service: req.body.service,
        review: req.body.review,
        rating: req.body.rating,
    })

    review
        .save()
        .then(result => {
            res.status(201).json({
                message: "review_created",
                createdReviewItem: {
                    _id: result._id,
                    buyer: result.buyer,
                    service: result.service,
                    review: result.review,
                    rating: result.rating,
                    date: new Date(result.timestamp).toDateString()
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
}