const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const prodetails = require('../models/products');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const productController = require('../controller/products')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
    cb(null,'./uploads/');

},
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = function(req, file, cb) {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    {
        cb(null, true)
    }else{
        cb(null, false)
    }
}
const upload = multer({storage: storage , 
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter : fileFilter
})


router.get('/', productController.products_get_all);


router.post('/', checkAuth,upload.single('productImage'), productController.products_create_product);


router.get('/:productID', productController.products_getone_product);


router.patch('/:productID', checkAuth, productController.products_update_product);


router.delete('/:productID', checkAuth, productController.products_delete_product);


module.exports = router;