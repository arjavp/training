const express = require('express');
const productRoute = require('./api/router/product');
const orderRoute = require('./api/router/orders');
const userRoute = require('./api/router/users')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose"); 
const app = express();


mongoose.connect('mongodb+srv://root:user123@cluster0.ubeyl.mongodb.net/test')
// mongoose.connect('mongodb+srv://arjavp:97QqSGeQpTsD8ZzX4jUywWX98mTbv92n@cluster0.ubeyl.mongodb.net/arjavp');

//load request loggs 
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());


app.use('/product', productRoute);
app.use('/orders', orderRoute);
app.use('/user', userRoute);



app.use( ( req, res, next ) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods',  ' PUT, GET, POST, DELETE, PATCH ');
        return res.status(200).json({});
    }
    next();
})



app.use(( req, res, next) => {
    const error = new error('not found');
    error.status(404);
    next(error);
});


app.use( ( error, req, res, next ) => {
    res.status( error.status || 500);
    res.json({
        error :{ message: error.message }
    });
});


module.exports = app ;
