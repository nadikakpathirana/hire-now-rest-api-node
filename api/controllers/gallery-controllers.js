const Gallery = require('../models/gallery');
const mongoose = require("mongoose");
const Service = require("../models/service");
const User = require("../models/user");

exports.get_all_of_seller = (req, res, next) => {
    const sellerID = req.params.sellerID;
    User.find({username: sellerID})
        .exec()
        .then(doc => {
            if (doc) {
                doc = doc[0];
                Gallery.find({provider: doc._id}).populate('provider')
                    .exec()
                    .then(docs => {
                        if (docs.length > 0) {
                            const response = {
                                count: docs.length,
                                images: docs.map( doc => {
                                    return {
                                        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdXrN5H9Es9LsjxqNrUFbuEXtdc6q1457prQ&usqp=CAU",
                                        _id: doc._id,
                                    }
                                })
                            }
                            res.status(200).json(response);
                        } else {
                            res.status(404).json({error: 'category_empty'});
                        }

                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })

            } else {
                res.status(404).json({message: 'not valid seller for that id'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
}

exports.add_new_image = (req, res, next) => {
    User.find({username: req.body.provider})
        .exec()
        .then(doc => {
            if (doc) {
                doc = doc[0];
                const gallery = new Gallery({
                    _id: new mongoose.Types.ObjectId(),
                    img: req.body.img,
                    provider: doc._id
                })
                gallery.save()
                    .then(result => {
                        res.status(201).json({
                            message: "gallery_created",
                            createdGallery: {
                                img: result.img,
                                provider: result.provider,
                                _id: result._id,
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err})
                    })

            } else {
                res.status(404).json({message: 'not valid seller for that id'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
}