const express = require("express");
const route = express.Router();
const controller = require('../controller/controller');
const bodyParser = require('body-parser');
const course = require('../model/coursedb');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require("../database/conn");
const alert = require('alert');




var urlencodedParser = bodyParser.urlencoded({extended: false});

route.get('/', (req,res) => {
    sequelize.sync()
     .then((result) => {

    course.findAll({where: {cid:{
        [Op.ne] : null 
    }}}).then((result)=>{
        res.render('index',{data:result});
    });

// sequelize.query('SELECT * FROM mycourses ORDER BY cid ASC',{ type: sequelize.QueryTypes.SELECT}).then(course=>{
//     res.render('index', {data:course});
    //console.log(course);
//});
  
});
});

route.get('/add_course', (req,res) => {
    
    res.render('add_course');
});

route.post('/add_course', urlencodedParser ,( req, res ) => {
    course.create({course_name: req.body.name, duration: req.body.duration, fees: req.body.fees});
    alert("course added successfully!");
    res.redirect('/');
    // sequelize.sync()
    // .then((result) => {
    //  return sequelize.query('SELECT * FROM mycourses ORDER BY cid ASC',{ type: sequelize.QueryTypes.SELECT}).then(course=>{
    //     res.render('index', {data:course});
    //  })
    // });
});



route.get('/update-course/:id' ,(req,res) => {
    
    course.findByPk(req.params.id).then((result) => {
        console.log(result);
        res.render('update_course',{data: result, id: req.params.id});
    });
        
route.post('/update-course', urlencodedParser, ( req, res) => {
    course.update(
        {
          course_name: req.body.name,
          duration: req.body.duration,
          fees: req.body.fees
        },
        {
          where: { cid : Number(req.body.id)   }
        }
      );
      alert("updated successfully!!");
      res.redirect('/');

})
});

route.get('/delete/:id',(req,res)=>{
    course.destroy({where:{ cid : req.params.id }
});
alert('deleted successfully!!')
 res.redirect('/');
});





module.exports = route;