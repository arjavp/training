const express = require("express");
const route = express.Router();
const controller = require('../controller/controller');
const bodyParser = require('body-parser');
const course = require('../model/coursedb');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require("../database/conn");


var urlencodedParser = bodyParser.urlencoded({extended: false});

route.get('/', controller.fetchdata);

route.get('/add_course', (req,res) => {
    
    res.render('add_course');
});

route.post('/add_course', urlencodedParser , controller.insertData );

route.get('/update-course/:id' , controller.updateDataid);
        
route.post('/update-course', urlencodedParser, controller.updateData);

route.get('/delete/:id',controller.deleteData);



module.exports = route;