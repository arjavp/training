const express = require('express');
const route = express.Router();
const bodyParser = require('body-parser');



route.get('/',(req,res) => {
    res.render('index');
})

route.get('/login', (req,res) => {
    res.render('login');
})

route.get('/signup', (req,res) => {
    res.render('signup');
})





module.exports = route;