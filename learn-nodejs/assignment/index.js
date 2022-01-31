const fs = require("fs");

// create file called demo.txt.
    
    fs.writeFile( "demo.txt", "Node.js is an open source server environment" , (err) => {
        console.log( "file is created" );
        console.log(err);
    });

// // read that file
    
    fs.readFile( 'demo.txt','utf-8', (err,res) => {
        console.log(res);
        console.log(err);
    });

// // append some data into the file    
    
    fs.appendFile('demo.txt', "  Node.js allows you to run JavaScript on the server ", (err)=>{
        console.log( "file is updated" );
        console.log(err);
    })

// rename file to "final-demo.txt".
    
     fs.rename('demo.txt', 'final-demo.txt', (err) => {
         console.log( "file renamed" );
         console.log(err);
     });

 // delete the file

    fs.unlink('final-demo.txt', (err) => {
         console.log( "file deleted" );
         console.log(err);
     });