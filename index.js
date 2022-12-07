const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose')
const Router = require('./routes/routes')
const app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/tahir',(req,res)=>{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("tahir");
        //Find all documents in the customers collection:
        dbo.collection("tta").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
          res.json(result);
        });
      });
})


// app.get('/tahir',(req,res)=>{
//     database.collection('tta').find({}).toArray(err, result =>{
//         if(err){
//             console.log('')
//         }
//         res.send(result);
//     })
// })

mongoose.connect('mongodb://localhost:27017',{useNewUrlParser: true},(err, result)=>{

    if(err) throw console.error();
    // database = db.db("tahir");
    console.log("Connected")
})




app.use(bodyparser.json())

app.use('/routes',Router)

app.use(express.json());

const PORT = process.env.PORT || 9000;

app.listen(PORT);

