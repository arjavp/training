const express = require('express');
const toDoController = require('./controllers/toDoControllers.js');



const app = express();

app.set('view engine','ejs');

app.use(express.static('./assets'));

toDoController(app);


app.listen(4000);
console.log('you are listening to port 4000....');

 