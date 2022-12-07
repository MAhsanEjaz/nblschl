const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const userModel = require('../model/user');
const post = require('../model/post');
const data = require('../model/data');
const stripe = require("stripe")(process.env.STRIPE_KEY);


app.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});



// app.post('/post', (req, res)=>{
//     const data = post({
//         title: req.body.title
//     })
//     data.save().then(saveData =>{
//         res.status(201).json({saveData})
//     })
// })

app.post("/", (req, res, next) => {
    const product = new post({
      title: req.body.title, 
    });
    product
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Created product successfully",
          createdProduct: {
              title: result.title,
            
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });


// app.get('',async(req, res)=>{
//     const data = await post.find({})
// res.json(data)
// })




app.get("/", (req, res, next) => {
    post.find()
      .exec()
      .then(docs => {
        const response = {
          count: docs.length, 
          data: docs.map(doc => {
            return {
              title: doc.title,
            };
          })
        };
         
        res.status(200).json(response);
      
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });


app.get('',async(req, res)=>{
  const myData =await data({

    WorkloadI: req.body.WorkloadI,
    CPUUtilization: req.body.CPUUtilization,
    Networking_Average: req.body.Networking_Average,
    MemoryUtilization_Average: req.body.MemoryUtilization_Average,
    Final_Target: req.body.Final_Target

  })
  myData.save().then(ourData=>{
    res.send.json(ourData);
    res.status(200).json({"message": "Data Successful"});
  })

})



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