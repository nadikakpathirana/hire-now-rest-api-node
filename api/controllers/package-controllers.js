const Package = require('../models/package');
const mongoose = require("mongoose");

// get all packages of a seller
exports.get_packages_of_a_seller = (req, res, next) => {
    const sellerID = req.params.sellerID;
    Package.find({"seller": sellerID})
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    packages: docs.map( doc => {
                        return {
                            name: doc.name,
                            title: doc.title,
                            seller: doc.seller,
                            service: doc.service,
                            description: doc.description,
                            charges: doc.charges,
                            _id: doc._id
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'package_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

// get a specific package info
exports.get_specific_package = (req, res, next) => {
    const id = req.params.packageID;
    Package.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    order: doc,
                });
            } else {
                res.status(404).json({message: 'package_empty'})
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
}

//create a new package
exports.create_a_package = (req, res, next) => {
    const package = new Package({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        title: req.body.title,
        seller: req.body.seller,
        service: req.body.service,
        description: req.body.description,
        charges: req.body.charges,
    })

    package.save()
        .then(result => {
            res.status(201).json({
                message: "package_created",
                createdService: {
                    name: result.name,
                    title: result.title,
                    seller: result.seller,
                    service: result.service,
                    description: result.description,
                    charges: result.charges,
                    _id: result._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
}

// update a package
exports.update_a_package = (req, res, next) => {
    const id = req.params.packageID;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Package.update({_id:id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "package_updated"
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}

// remove a package
exports.remove_a_package = (req, res, next) => {
    const id = req.params.packageID;
    Package.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "package_deleted"
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}