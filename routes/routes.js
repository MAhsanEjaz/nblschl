const express = require('express');

const app = express.Router();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const userModel = require('../model/user');


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