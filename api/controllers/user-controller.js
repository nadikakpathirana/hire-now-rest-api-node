const User = require('../models/user');
const bcript = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Service = require('../models/service');

exports.get_all_users = (req, res, next) => {
    User.find()
        // .select("name price _id")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    users: docs.map( doc => {
                        return {
                            _id: doc._id,
                            username:doc.username,
                            firstName: doc.firstName,
                            lastName: doc.lastName,
                            email: doc.email,
                            address: doc.address,
                            dob: doc.dob,
                            proPic: doc.proPic,
                            country: doc.country,
                            password: doc.password,
                            phoneNumber: doc.phoneNumber,
                            userType: doc.userType,

                            // request: {
                            //     type: 'GET',
                            //     url: 'http://localhost:3000/products/' + doc._id
                            // }
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'user_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

exports.get_user_counts = (req, res, next) => {
    try {
        var count = {
            users: 0,
            sellers: 0,
            services: 0
        }
        User.find()
            .exec()
            .then(docs => {
                count.users = docs.length;
                User.find({userType: "seller"})
                    .exec()
                    .then(docs => {
                        count.sellers = docs.length;
                        Service.find()
                            .exec()
                            .then(docs => {
                                count.services = docs.length;
                                console.log(docs.length);
                                console.log(count);
                                res.status(200).json({status: count});
                            })
                    })
            })
    }
    catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

exports.get_sellers = (req, res, next) => {
    User.find({userType: "buyer"})
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    users: docs.map( doc => {
                        return {
                            _id: doc._id,
                            username:doc.username,
                            proPic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdXrN5H9Es9LsjxqNrUFbuEXtdc6q1457prQ&usqp=CAU",
                            rating: 4,
                            description: "descriptiondescriptiondescription vdescription description description"
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'user_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

exports.register_new_user = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email already exists"
                })
            } else {
                bcript.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error:err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash
                        })
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: "user created.",
                                    user: {
                                        username: result.username,
                                        firstName: result.firstName,
                                        lastName: result.lastName,
                                        email: result.email,
                                        isSellerActivated: result.isSellerActivated
                                    }
                                })
                            })
                            .catch( err => {
                                console.log(err);
                                res.status(500).json({error: err})
                            })
                    }
                })
            }
        })
}

exports.get_user_token = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Mail not found, user doesn't exist"
                })
            }
            bcript.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "2h"
                        }
                    );
                    res.status(200).json({
                        message: "Auth successful",
                        token: token,
                        user: {
                            username: user[0].username,
                            firstName: user[0].firstName,
                            lastName: user[0].lastName,
                            email: user[0].email,
                            isSellerActivated: user[0].isSellerActivated
                        }
                    })
                } else {
                    res.status(401).json({
                        message: "Auth failed"
                    })
                }
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
}

exports.get_user_info = (req, res, next) => {
    const id = req.params.userID;
    User.find({username: id})
        // .select("name price _id")
        .exec()
        .then(doc => {
            if (doc) {
                doc = doc[0];
                res.status(200).json({
                    _id: doc._id,
                    username:doc.username,
                    firstName: doc.firstName,
                    lastName: doc.lastName,
                    email: doc.email,
                    address: doc.address,
                    dob: doc.dob,
                    proPic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdXrN5H9Es9LsjxqNrUFbuEXtdc6q1457prQ&usqp=CAU",
                    phoneNumber: doc.phoneNumber,
                    userType: doc.userType,
                    city: "Nagaraya",
                    availability: "Full time",
                    job: "Any",
                    rating: 7,
                    about: "halidi auia adjgaoiygfahf audgfaufditpawefha uawfouaiflajdhfduiaf ewgoauwefaweouif wae9ufewufawuf "
                });
            } else {
                res.status(404).json({message: 'not valid entry for that id'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
}


exports.check_is_valid_token = (req, res, next) => {
    const id = req.userData.email;
    User.find({email: id})
        // .select("name price _id")
        .exec()
        .then(doc => {
            if (doc) {
                doc = doc[0]
                res.status(200).json({
                    _id: doc._id,
                    username:doc.username,
                    firstName: doc.firstName,
                    lastName: doc.lastName,
                    email: doc.email,
                    address: doc.address,
                    dob: doc.dob,
                    country: doc.country,
                    phoneNumber: doc.phoneNumber,
                    userType: doc.userType,
                    isSellerActivated: doc.isSellerActivated
                });
            } else {
                res.status(404).json({message: 'not valid entry for that id'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
}

exports.update_user_info = (req, res, next) => {
    const id = req.params.userID;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    User.update({_id:id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "user updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/users/' + id
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}

exports.remove_a_user = (req, res, next) => {
    const id = req.params.userID;
    User.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/users/',
                    body: {
                        username: 'String',
                        firstName: 'String',
                        lastName: 'String',
                        email: 'String',
                        address: 'String',
                        dob: 'String',
                        country: 'String',
                        password: 'String',
                        phoneNumber: 'String'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}