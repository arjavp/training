const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//var data = [{item:'read book'},{item:'learn nodejs'},{item:'practice it'}];

mongoose.connect('mongodb+srv://Jigar:test@cluster0.ma0nl.mongodb.net/cluster0?retryWrites=true&w=majority')
var mySchema = new mongoose.Schema({
    item: String
})

var myModel = mongoose.model('myModel',mySchema);

// var itemOne = myModel({item:'go get milk'}).save((err)=>{
//     if (err) throw err;
//     console.log('Item added Successfully.');
// })

module.exports = function(app) {

    app.get('/todo',(req,res)=>{
        
        myModel.find({},(err,data)=>{
            if (err) throw err;
            res.render('todo',{data:data});
        })
        

    });

    app.post('/todo',urlencodedParser,(req,res)=>{
        
        var newData = myModel(req.body).save((err,data)=>{
            if (err) throw err;
            res.json(data);
        })
        //data.push(req.body);
        //res.json(data);
        
    });

    app.delete('/todo/:item',(req,res)=>{
        // data = data.filter((todo)=>{
        //     return todo.item/*replace(/ /g,'-')*/ !== req.params.item;
        // })
        // res.json(data);

        // myModel.find({item:req.params.item}).remove((err,data)=>{
        //     if (err) throw err;
        //     res.json(data);
        // })

        myModel.deleteMany({item:req.params.item},(err)=>{
            if (err) throw err;
            myModel.find({},(err,data)=>{
                if (err) throw err;
                res.render('todo',{data:data});
            })
        })    //<= just tried

        
    });
    
};

