const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcript = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');


router.get('/', (req, res, next) => {
    User.find()
        // .select("name price _id")
        .exec()
        .then(docs => {
            // if (docs.length > 0) {
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
            // } else {
            //     res.status(404).json({error: 'empty collection'});
            // }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/signup', (req, res, next) => {
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
                            address: req.body.address,
                            dob: req.body.dob,
                            country: req.body.country,
                            password: hash,
                            phoneNumber: req.body.phoneNumber,

                        })
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: "user created."
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
});

router.post('/login', (req, res, next) => {
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
                        token: token
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
});



// router.get('/:userID', (req, res, next) => {
//     const id = req.params.userID;
//     User.findById(id)
//         // .select("name price _id")
//         .exec()
//         .then(doc => {
//             if (doc) {
//                 res.status(200).json({
//                     _id: doc._id,
//                     username:doc.username,
//                     firstName: doc.firstName,
//                     lastName: doc.lastName,
//                     email: doc.email,
//                     address: doc.address,
//                     dob: doc.dob,
//                     country: doc.country,
//                     password: doc.password,
//                     phoneNumber: doc.phoneNumber,
//                     userType: doc.userType,
//                     // request: {
//                     //     type: 'GET',
//                     //     url: 'http://localhost:3000/products/' + doc._id
//                     // }
//                 });
//             } else {
//                 res.status(404).json({message: 'not valid entry for that id'})
//             }
//
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({error:err})
//         })
// })
//
// router.patch('/:userID', (req, res, next) => {
//     const id = req.params.userID;
//     const updateOps = {};
//
//     for (const ops of req.body) {
//         updateOps[ops.propName] = ops.value;
//     }
//
//     User.update({_id:id}, {$set: updateOps})
//         .exec()
//         .then(result => {
//             res.status(200).json({
//                 message: "user updated",
//                 request: {
//                     type: 'GET',
//                     url: 'http://localhost:3000/users/' + id
//                 }
//             });
//         })
//         .catch(err => {
//             res.status(500).json({error: err});
//         })
// })

router.delete('/:userID', (req, res, next) => {
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
})


module.exports = router;