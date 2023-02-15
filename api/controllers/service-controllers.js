const Service = require('../models/service');
const mongoose = require("mongoose");
const multer = require('multer');


const utils = require('./utils');


exports.get_all_services = (req, res, next) => {
    Service.find()
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
                            category: doc.category,
                            provider: doc.provider,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/service/' + doc._id
                            }
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
    Service.find({username: id})
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    services: docs.map( doc => {
                        return {
                            title: doc.title,
                            serviceImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5o1JEx5HkuIza83FgPMcXYA5aylxAwGXGyA&usqp=CAU",
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

exports.get_suggested_services = (req, res, next) => {
    Service.find().populate('provider')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                docs = utils.getMultipleRandom(docs, 10)
                const response = {
                    count: docs.length,
                    services: docs.map( doc => {
                        return {
                            name: `${doc.provider.firstName} ${doc.provider.lastName}`,
                            title: doc.title,
                            // description: doc.description,
                            serviceImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5o1JEx5HkuIza83FgPMcXYA5aylxAwGXGyA&usqp=CAU",
                            proPic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdXrN5H9Es9LsjxqNrUFbuEXtdc6q1457prQ&usqp=CAU",
                            // category: doc.category,
                            // provider: doc.provider,
                            _id: doc._id,
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
                docs = utils.getMultipleRandom(docs, 10)
                const response = {
                    count: docs.length,
                    services: docs.map( doc => {
                        return {
                            name: `${doc.provider.firstName} ${doc.provider.lastName}`,
                            title: doc.title,
                            // description: doc.description,
                            serviceImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5o1JEx5HkuIza83FgPMcXYA5aylxAwGXGyA&usqp=CAU",
                            proPic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdXrN5H9Es9LsjxqNrUFbuEXtdc6q1457prQ&usqp=CAU",
                            // category: doc.category,
                            // provider: doc.provider,
                            _id: doc._id,
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
                            serviceImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5o1JEx5HkuIza83FgPMcXYA5aylxAwGXGyA&usqp=CAU",
                            // description: doc.description,
                            description: " abouteuaglie ileh lweigieakgloi gdali weli",
                            _id: doc.provider.username
                        },
                        seller: {
                            _id: doc.provider._id,
                            name: doc.provider.username,
                            proPic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdXrN5H9Es9LsjxqNrUFbuEXtdc6q1457prQ&usqp=CAU",
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
        name: req.body.name,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
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

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Service.update({_id:id}, {$set: updateOps})
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
            res.status(500).json({error: err});
        })
}

exports.remove_a_service = (req, res, next) => {
    const id = req.params.serviceID;
    Service.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "service_deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/services/',
                    body: {
                        name: 'String',
                        title: 'String',
                        description: 'String',
                        category: 'String',
                        provider: 'String'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}