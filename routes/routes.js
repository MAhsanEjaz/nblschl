const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const userModel = require('../model/user');
const post = require('../model/post');



app.post('/post', (req, res)=>{
    const data = post({
        title: req.body.title
    })
    data.save().then(saveData =>{
        res.status(201).json({saveData})
    })
})


// app.get('',async(req, res)=>{
//     const data = await post.find({})
// res.json(data)
// })



app.get("/", (req, res, next) => {
    post.find()
      .select("name price _id productImage")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          data: docs.map(doc => {
            return {
              title: req.body.title,
              request: {
                title: req.body.title,
                type: "GET",
                // url: "http://localhost:3000/products/" + doc._id
              }
            };
          })
        };
        //   if (docs.length >= 0) {
        res.status(200).json(response);
        //   } else {
        //       res.status(404).json({
        //           message: 'No entries found'
        //       });
        //   }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });



class userController{
    static userRegistration = async (req, res)=>{
        const {email, address, password, role, confirmPassword} = req.body
        const user = await userModel.findOne({email: email})
        if(user){
            res.send({"message": "Email already exists"})
        }else{
            if (email && password && confirmPassword && role && address ){
                if(password === confirmPassword){
                    try{
                        const salt = await (await bcrypt.genSalt(10))
                        const hashPassword = await bcrypt.hash(password, salt)
                        const doc = new userModel({
                            email: email,
                            password: hashPassword,
                            role: role,
                            address: address
                        })
                        await doc.save()
                        const saveUser = await userModel.findOne({email: email})
                        const token = jsonwebtoken.sign({userID: saveUser._id},"dhsjf3423jhsdf3423df",{expiresIn: "5d"})
                        res.status(201).send({"message": "Ok ho gya", "token": token,"email": email,"role": role})
                    }catch(err){
                        print(err)
                    }
                }else{
                    res.send({"message": "Password not match"})
                }
            }else{
                res.send({"message": "Field are required"})
            }
        }
    }




}


app.post('/register', userController.userRegistration)

module.exports = app;