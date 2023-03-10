const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    // reject file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/products');


router.get('/', (req, res, next) => {
    Product.find()
        .select("name price _id")
        .exec()
        .then(docs => {
            // if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    products: docs.map( doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + doc._id
                            }
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


    // Product.find()
    //     .then((doc) => {
    //         res.status(200).json(doc)
    //     })
    //     .catch((err) => {
    //         res.status(200).json({err:err})
    //     })
});

router.post('/',upload.single('productImage'), (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        image: req.file.path
    })

    product
        .save()
        .then(result => {
            res.status(201).json({
                message: "Create product successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
        .select("name price _id")
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                });
            } else {
               res.status(404).json({message: 'not valid entry for that id'})
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
})

router.patch('/:productID', (req, res, next) => {
    const id = req.params.productID;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.update({_id:id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "product updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
})

router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: { name: 'String', price: 'Number'}
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
})


module.exports = router;