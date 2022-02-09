const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const path = require("path");
const sequelize = require('./server/database/conn');
const course = require('./server/model/coursedb');

const app = express();

dotenv.config( { path: 'config.env' } );
const PORT = process.env.PORT || 8080;

// Log requests
app.use(morgan('tiny'));

// Parse the requests

app.use(bodyparser.urlencoded({ extended : true}));

// Set view Engine

app.set("view engine", 'ejs');

//load assets

app.use('/css', express.static(path.resolve(__dirname,"assets/css")));
app.use('/img', express.static(path.resolve(__dirname,"assets/img")));
app.use('/js', express.static(path.resolve(__dirname,"assets/js")));



//Load routers

app.use('/',require('./server/routes/routers'));

//database connection
sequelize.sync()//.then((result) => {
    //return course.create({course_name: "Javascript", duration: 15, fees: 12000, status: true})
    //console.log(result);
//})
.then( arjavp => {
    console.log("database connected ")
    //console.log("course are: " , arjavp)
})
.catch((err) => {
    console.log(err);
})

app.listen(PORT,() => { console.log(`server is running on http://localhost:${PORT} `)});

