const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose')
const Router = require('./routes/routes')
const app = express();

mongoose.connect(process.env.DATABASE || 'mongodb+srv://school:school12345@cluster0.2veb9ns.mongodb.net/?retryWrites=true&w=majority',(err)=>{
    if(!err){
        console.log('DB connected')
    }else{
        console.log('Not connected')
    }
})

app.use(bodyparser.json())

app.use('/routes',Router)

app.use(express.json());

const PORT = process.env.PORT || 9000;

app.listen(PORT);

