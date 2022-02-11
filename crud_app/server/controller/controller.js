const course = require('../model/coursedb');
const bodyParser = require('body-parser');
const express = require('express');
const route = express.Router();

const sequelize = require('../database/conn');

module.exports ={
    fetchdata : (req,res) => {
        sequelize.sync()
         .then((result) => {
    
        course.findAll( 
        ).then((result)=>{
            res.render('index',{data:result});
        });});
    },

    insertData : ( req, res ) => {

        course.create({course_name: req.body.name, duration: req.body.duration, fees: req.body.fees});
        res.redirect('/');
    },

    updateDataid : (req,res) => {
    
        course.findByPk(req.params.id).then((result) => {
            console.log(result);
            res.render('update_course',{data: result, id: req.params.id});
        });
    },

    updateData : ( req, res) => {
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
          res.redirect('/');
    
    },
   deleteData : (req,res)=>{
        course.destroy({where:{ cid : req.params.id }
    });
     res.redirect('/');
} 
}