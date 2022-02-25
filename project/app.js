const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const myRoutes = require('./server/routes/router')


const app = express();


// Log requests 

app.use(morgan('tiny'));

// parse requests

//app.use(bodyParser.urlencoded({ extended: false }));


// Set view engine

app.set('view engine', 'ejs');


//Load routes


app.get('/', myRoutes)





app.listen(3000, () => {console.log(`server is running on http://localhost:3000`)})