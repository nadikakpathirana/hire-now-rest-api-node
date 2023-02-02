const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


const Category = require('../models/category');

// get all categories
router.get('/', (req, res, next) => {
    Category.find()
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    categories: docs.map( doc => {
                        return {
                            name: doc.name,
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
});

// get a specific category
router.get('/:categoryID', (req, res, next) => {
    const id = req.params.categoryID;
    Category.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    category: doc,
                });
            } else {
                res.status(404).json({message: 'category_empty'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
})

// create a category
router.post('/', (req, res, next) => {
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    })

    category.save()
        .then(result => {
            res.status(201).json({
                message: "category_created",
                createdCategory: {
                    name: result.name
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
});

// update a category
router.patch('/:categoryID', (req, res, next) => {
    const id = req.params.categoryID;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Category.update({_id:id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "category_updated",
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
})

// delete a category
router.delete('/:categoryID', (req, res, next) => {
    const id = req.params.categoryID;
    Category.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "category_deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/categories/',
                    body: {
                        name: 'String',
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
})

module.exports = router;