const course = require('../model/coursedb');
const bodyParser = require('body-parser');
const express = require('express');
const route = express.Router();

const sequelize = require('../database/conn');

//const fetchData = require('/fetchData.js')



 var urlencodedParser = bodyParser.urlencoded({extended: false});



//create new course


// route.post('/add_course', urlencodedParser ,( req, res ) => {
//     sequelize.sync()
//     .then((result) => {
//     return course.create({course_name: req.body.name, duration: req.body.duration, fees: req.body.fees, status: req.body.status});
//     })
//     });






// exports.create = (req,res) => {
//     // validate request
//     if(!req.body)
//     res.status(404).send({message: "Details can not be empty"});

//     // new course
//     const ncourse = new course({
//         course_name : req.body.course_name,
//         duration : req.body.duration,
//         fees : req.body.fees,
//         status : req.body.duration
//     })

//     // save course
    
//     ncourse.save(ncourse).then(data => {
//         res.send(data)
//     })
//     .catch(err => {
//         res.status(404).send({message : err.message || "some error in create operation"})
//     })
// }


//retrive and return all courses / single course

// exports.find = (req,res) =>{
//     ncourse.find()
//     .then(ncourse => {
//         res.send(ncourse);
//     })
//     .catch(err => {
//         res.status(404).send({message: err.message})
//     })
// }

// // update course
// exports.update = (req,res) => {

// }



// API

//  route.post('/api/course', controller.create);
// route.get('/api/course', controller.find);
// route.put('/api/course/:id', controller.update);
// route.delete('/api/course/:id', controller.delete);


// route.get('/', services.homeRoutes);

// route.get('/add_course', services.add_course);

// route.get('/update_course',services.update_course);
