const Service = require('../models/service');
const mongoose = require("mongoose");
const multer = require('multer');


const utils = require('./utils');
const User = require("../models/user");


exports.get_all_services = (req, res, next) => {
    const page = parseInt(req.params.page) || 1; // current page number
    const limit = 15; // number of items to return per page
    const skip = (page - 1) * limit; // number of items to skip from the beginning
    Service.find().skip(skip).limit(limit).populate('provider')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    page: page,
                    limit: limit,
                    services: docs.map( doc => {
                        return {
                            _id: doc._id,
                            title: doc.title,
                            serviceImg: doc.serviceImg,
                            description: doc.description,
                            name: doc.provider.username,
                            proPic: doc.provider.proPic,
                            location: doc.provider.location,
                            rateOfPayment: doc.rateOfPayment,
                            price: doc.price,
                            category: doc.category,
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
                            rateOfPayment: doc.rateOfPayment,
                            price: doc.price,
                            category: doc.category,
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
                            rateOfPayment: doc.rateOfPayment,
                            price: doc.price,
                            category: doc.category,
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

exports.get_suggested_services_with_id = (req, res, next) => {
    const id = req.params.userID;
    User.findById(id)
        .exec()
        .then((user) => {
            const previous_search_keys = user.previous_search_keys || [];
            const query = {
                $or: [
                    { keywords: { $in: previous_search_keys}},
                    { category: {$in: previous_search_keys }}
                ]
            };

            Service.find(query).populate('provider')
                .exec()
                .then(docs => {
                    if (docs.length > 0) {

                        // Calculate the relevance score for each service
                        docs.forEach(service => {
                            let relevance_score = 0;
                            previous_search_keys.forEach(keyword => {
                                if (service.keywords.includes(keyword)) {
                                    relevance_score += 1;
                                }
                                if (service.category === keyword) {
                                    relevance_score += 1;
                                }
                            });
                            service.relevance_score = relevance_score;
                        });

                        const sorted_services = docs.sort((a, b) => b.relevance_score - a.relevance_score);


                        const N = 12;
                        const top_services = sorted_services.slice(0, N);

                        const response = {
                            count: top_services.length,
                            services: top_services.map( doc => {
                                return {
                                    _id: doc._id,
                                    title: doc.title,
                                    serviceImg: doc.serviceImg,
                                    description: doc.description,
                                    name: doc.provider.username,
                                    proPic: doc.provider.proPic,
                                    location: doc.provider.location,
                                    rateOfPayment: doc.rateOfPayment,
                                    price: doc.price,
                                    category: doc.category,
                                    rating: 3,
                                }
                            })
                        }
                        res.status(200).json(response);
                    } else {
                        Service.find().populate('provider')
                            .exec()
                            .then(docs => {
                                if (docs.length > 0) {
                                    docs = utils.getMultipleRandom(docs, 12)
                                    const response = {
                                        services: docs.map( doc => {
                                            return {
                                                _id: doc._id,
                                                title: doc.title,
                                                serviceImg: doc.serviceImg,
                                                description: doc.description,
                                                name: doc.provider.username,
                                                proPic: doc.provider.proPic,
                                                location: doc.provider.location,
                                                rateOfPayment: doc.rateOfPayment,
                                                price: doc.price,
                                                category: doc.category,
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

                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_popular_services = (req, res, next) => {
    Service.find({isP: true}).populate('provider')
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
                            rateOfPayment: doc.rateOfPayment,
                            price: doc.price,
                            category: doc.category,
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
                            rateOfPayment: doc.rateOfPayment,
                            price: doc.price,
                            category: doc.category,
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
        category: req.body.category,
        provider: req.body.provider,
        rateOfPayment: req.body.rop,
        price: req.body.price || 0,
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
                    rateOfPayment: result.rateOfPayment,
                    price: result.price,
                    serviceImg: result.serviceImg,
                    _id: result._id,
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

    if(req.body.category){
        updateOps["category"] = req.body.category;
    }

    if(req.body.description){
        updateOps["description"] = req.body.description;
    }

    if(req.body.rop){
        updateOps["rateOfPayment"] = req.body.rop;
    }

    if(req.body.price){
        updateOps["price"] = req.body.price;
    }

    // service image
    if(req.file){
        if(req.file.path){
            updateOps["serviceImg"] = req.file.path;
        }
    }

    Service.updateOne({_id:id}, {$set: updateOps})
        .exec()
        .then(doc => {
            res.status(200).json({
                message: "service_updated",
                status: true
                // service: {
                //     service: {
                //         title: doc.title,
                //         serviceImg: doc.serviceImg,
                //         description: doc.description,
                //         rateOfPayment: doc.rateOfPayment,
                //         price: doc.price,
                //         category: doc.category,
                //         _id: doc._id
                //     },
                //     seller: {
                //         _id: doc.provider._id,
                //         name: doc.provider.username,
                //         proPic: doc.provider.proPic,
                //         rating: 3,
                //     },
                // }
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