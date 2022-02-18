const mongoose = require('mongoose');

const Order = require('../models/order');
const prodetails = require('../models/products');


exports.ordres_get_all = ( req, res, next) => {
    Order.find()
    .select(" product quantity _id")
    .populate('product', 'name _id')
    .then(docs => {
        //console.log(docs);
        res.status(200).json({
            count : docs.length,
            orders: docs.map(doc =>{
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request:{
                        type : "GET",
                        url: "http://localhost:3000/orders/" + doc._id 
                    }
                }
            })
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
};

exports.orders_create_order =  ( req, res, next) => {
    prodetails.findById(req.body.productId)
    .then(product => {

        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });
    
        return order
        .save()
        
        .then(result => {
            if(!product){
                res.status(404).json({
                    message : "product not found"
                });
            }
            console.log(result);
            res.status(201).json({
                message : "order stored",
                createdOrder:{
                    _id: result._id,
                    product: result.productId,
                    quantity: result.quantity
                },
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders/" + result._id
                }
            })
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                message: "product not found",
                error : err
            })
     
    })
    
    })

    

}

exports.orders_getone_order = ( req, res, next) => {
    Order.findById(req.params.orderId)
    .select(" _id product quantity")
    .populate('product')
    .then( order => {
         if(!order){
             return res.status(404).json({
                 message : "order  not found"
             })
         }
        console.log(order);
        res.status(200).json({
            message : "order details",
            order: order,
            request:{
                type : "GET",
                url: "http://localhost:3000/orders"
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
 }


 exports.orders_delete_order = ( req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then( result => {
        console.log(result);
        res.status(200).json({
            message : "order deleted",
            request:{
                type : "POST",
                url: "http://localhost:3000/orders"
            },
            body:{ product: 'ID', quantity : "Number" }
        })
    })

    .catch(err => {
       console.log(err);
       res.status(500).json({
           error : err
       })
   })
}