const Service = require('../models/service');
const mongoose = require("mongoose");
const multer = require('multer');


const utils = require('./utils');
const User = require("../models/user");


exports.get_all_services = (req, res, next) => {
    Service.find().populate('provider')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    services: docs.map( doc => {
                        return {
                            _id: doc._id,
                            title: doc.title,
                            serviceImg: doc.serviceImg,
                            description: doc.description,
                            name: doc.provider.username,
                            proPic: doc.provider.proPic,
                            location: doc.provider.location,
                            rating: 3,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'service_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.search_services = (req, res, next) => {
    const searchKey = req.params.searchKey;
    const regexPattern = new RegExp(`^${searchKey}`, 'i');
    Service.find({title: regexPattern}).populate('provider')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    services: docs.map( doc => {
                        return {
                            _id: doc._id,
                            title: doc.title,
                            serviceImg: doc.serviceImg,
                            description: doc.description,
                            name: doc.provider.username,
                            proPic: doc.provider.proPic,
                            location: doc.provider.location,
                            rating: 3,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'service_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_all_services_of_a_category = (req, res, next) => {
    const id = req.params.categoryID;
    Service.find({category:id})
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    services: docs.map( doc => {
                        return {
                            name: doc.name,
                            title: doc.title,
                            description: doc.description,
                            // category: doc.category,
                            provider: doc.provider,
                            _id: doc._id
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'service_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_all_services_of_a_seller = (req, res, next) => {
    const id = req.params.sellerID;
    User.findOne({username: id})
        .exec()
        .then(result => {
            if (result) {
                Service.find({provider: result._id})
                    .exec()
                    .then(docs => {
                        console.log(docs);
                        if (docs.length > 0) {
                            const response = {
                                count: docs.length,
                                services: docs.map( doc => {
                                    return {
                                        title: doc.title,
                                        serviceImg: doc.serviceImg,
                                        _id: doc._id
                                    }
                                })
                            }
                            res.status(200).json(response);
                        } else {
                            res.status(404).json({error: 'service_empty'});
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
            } else {
                res.status(200).json({message: 'not valid entry for that id'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
}

exports.get_suggested_services = (req, res, next) => {
    Service.find().populate('provider')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                docs = utils.getMultipleRandom(docs, 12)
                const response = {
                    count: docs.length,
                    services: docs.map( doc => {
                        return {
                            _id: doc._id,
                            title: doc.title,
                            serviceImg: doc.serviceImg,
                            description: doc.description,
                            name: doc.provider.username,
                            proPic: doc.provider.proPic,
                            location: doc.provider.location,
                            rating: 3,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'service_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_popular_services = (req, res, next) => {
    Service.find().populate('provider')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                docs = utils.getMultipleRandom(docs, 12)
                const response = {
                    count: docs.length,
                    services: docs.map( doc => {
                        return {
                            _id: doc._id,
                            title: doc.title,
                            serviceImg: doc.serviceImg,
                            description: doc.description,
                            name: doc.provider.username,
                            proPic: doc.provider.proPic,
                            location: doc.provider.location,
                            rating: 3,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'service_empty'});
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_specific_service = (req, res, next) => {
    const id = req.params.serviceID;
    Service.findById(id).populate('provider')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    service: {
                        service: {
                            title: doc.title,
                            serviceImg: doc.serviceImg,
                            description: doc.description,
                            _id: doc._id
                        },
                        seller: {
                            _id: doc.provider._id,
                            name: doc.provider.username,
                            proPic: doc.provider.proPic,
                            rating: 3,
                        },
                    }
                });
            } else {
                res.status(404).json({message: 'service_empty'})
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
}

exports.create_a_service = (req, res, next) => {
    const service = new Service({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        // category: req.body.category,
        provider: req.body.provider,
        serviceImg: req.file.path
    })

    service.save()
        .then(result => {
            res.status(201).json({
                message: "service_created",
                createdService: {
                    name: result.name,
                    title: result.title,
                    description: result.description,
                    category: result.category,
                    provider: result.provider,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/service/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
}

exports.update_a_service = (req, res, next) => {
    const id = req.params.serviceID;
    const updateOps = {};

    if(req.body.title){
        updateOps["title"] = req.body.title;
    }

    // if(req.body.category){
    //     updateOps["category"] = req.body.category;
    // }

    if(req.body.description){
        updateOps["description"] = req.body.description;
    }

    // service image
    if(req.file){
        if(req.file.path){
            updateOps["serviceImg"] = req.file.path;
        }
    }

    Service.updateOne({_id:id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "service_updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })
}

exports.remove_a_service = (req, res, next) => {
    const id = req.params.serviceID;
    Service.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "service_deleted"
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}