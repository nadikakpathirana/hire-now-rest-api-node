const Gallery = require('../models/gallery');
const mongoose = require("mongoose");
const Service = require("../models/service");
const User = require("../models/user");

exports.get_all_of_seller = (req, res, next) => {
    const sellerID = req.params.sellerID;
    Gallery.find({provider: sellerID})
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    images: docs.map( doc => {
                        return {
                            img: doc.img,
                            _id: doc._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                const response = {
                    count: 0,
                    images: []
                }
                console.log("gallery_empty");
                res.status(200).json(response);
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.add_new_image = (req, res, next) => {
    console.log("tesysafy");
    User.find({username: req.body.username})
        .exec()
        .then(doc => {
            if (doc) {
                doc = doc[0];
                const gallery = new Gallery({
                    _id: new mongoose.Types.ObjectId(),
                    img: req.file.path,
                    provider: doc._id
                })
                gallery.save()
                    .then(result => {
                        res.status(201).json({
                            message: "gallery_created",
                            img: {
                                img: result.img,
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