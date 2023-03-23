const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const userModel = require('../model/user');
const post = require('../model/post');
const data = require('../model/data');
const newUsers = require('../model/neewuser')
const stripe = require("stripe")(process.env.STRIPE_KEY);
const multer = require('multer');
             

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




  // Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

// Create multer instance
const upload = multer({ storage: storage });







// Registration API
app.post('/api/register', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file.filename;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new newUsers({ name, email, password: hashedPassword, image });
    await user.save();
    res.status(200).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error registering user' });
  }
});



////login 	


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await newUsers.findOne({ email });
    if (!user) {
      res.status(400).send({ message: 'Invalid email or password' });
      return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(400).send({ message: 'Invalid email or password' });
      return;
    }
    res.status(200).send({ message: 'Logged in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error logging in' });
  }
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
                        const salt = await bcrypt.genSalt(10)
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