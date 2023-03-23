const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose')
const Router = require('./routes/routes');
const app = express();
var MongoClient = require('mongodb').MongoClient;

//fetch data from mongodb

app.get('/tahir',(req,res)=>{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("tahir");
        //Find all documents in the customers collection:
        dbo.collection("tt").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
          res.json(result);
        });
      });
})


//connect from mongodb

mongoose.connect(process.env.DATABASE|| 'mongodb://localhost:27017',(err)=>{
    if(!err){
        console.log('Connected')
    }else{
        console.log('Not Connected')
    }
})



app.use(bodyparser.json())

app.use('/routes',Router)

app.use(express.json());

const PORT = process.env.PORT || 9000;

app.listen(PORT);

