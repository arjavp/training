const mongoose = require('mongoose');

const prodetails = require('../models/products');


exports.products_get_all = ( req, res, next) => {
    prodetails.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            product: docs.map( doc =>{
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        URL: 'http://localhost:3000/product/' + doc._id
                    }

                }
            }

            )
        }

        console.log(response);
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({
            error : err
        })
    });


    // res.status(200).json({
    //     message : 'requesting data using get method'
    // });
}


exports.products_create_product = ( req, res, next) => {
    console.log(req.file)
    const product = new prodetails({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path

    });

    product.save().then( result => {
        console.log(result)
        res.status(201).json({
            message : 'handeling post methods',
            createdProduct : {
                name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'POST',
                        URL: 'http://localhost:3000/product/' + result._id
                    }
            }
        });
    }).catch(err => {
        
             console.log(err);
            res.status(500).json({
                error : err
            })
            });    
}

exports.products_getone_product = ( req, res, next) => {
    const id = req.params.productID;
    prodetails.findById(id)
    .select(' name price _id productImage')
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc)
        {
        res.status(200).json({
            message : "id details",
            request: {
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                type: "GET",
                url: 'http://localhost:3000/product/' + doc._id

            }
        });
        }
        else{
            res.status(404).json({
                message : "please enter valid id"
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
}

exports.products_update_product = ( req, res, next) => {
    const id = req.params.productID;
    const updateOps = {};
    for( const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    prodetails.update({_id : id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message : "updated Successfully",
            request: {
                type : "GET",
                url: "http://localhost:3000/product/" + id
            }
            
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
        
    })
}

exports.products_delete_product = ( req, res, next) => {
    const id = req.params.productID;
    prodetails.remove({
        _id :id
    }).exec()
    .then(result =>{
        console.log(result);
        res.status(202).json({
            message : "Deleted Successfully",
            request:{
                type: "delete",
                url: "http://localhost:3000/product/" + id
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({
            error : err
        })
    })
    
    

    // res.status(200).json({
    //     message : 'product deleted'
    // })
}