const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Token = require('../models/token');
const { sendVerificationMail } = require('../utils/verificationMailsender');

const customer = "Customer";

exports.signup = async (req, res) => {
    try {
      const { useremail, name, password, accounttype } = req.body;
      let userexit = await User.findOne({ useremail });
   
  
      
      if (userexit) {
        return res.status(400).send({ error:{message: "EMAIL_EXISTS"} });
      }
      // console.log("here")
      const user = new User({ useremail, name, password, accounttype:accounttype });
      await user.save();
  
      // Create a token for the user
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    //   console.log("user email is "+useremail)
      // Send the token to the client
     const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const authToken = new Token({ userId: user._id, token:randomString  });
      await authToken.save();
      console.log("token is "+authToken)
      await sendVerificationMail(useremail, randomString);
      
      res.status(201).send({  token ,useremail: user.useremail, name: user.name , accounttype: user.accounttype , credits: user.credits});
      
    } catch (error) {
      res.status(400).send(error);
    }
  };


  //login
  exports.login = async (req, res) => {
    try {
      const { useremail ,password  } = req.body;
      const user = await User.findOne({ useremail  });
      if (!user) {
    
        return res.status(401).send({ error:{message: "EMAIL_NOT_FOUND"} });
      }
      if(!(await bcrypt.compare(password, user.password))){
        return res.status(401).send({ error:{message: "INVALID_PASSWORD"} });
      }
      else{
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.send({ token ,useremail: user.useremail, name: user.name , accounttype: user.accounttype , credits: user.credits});
      }
    } catch (error) {
      res.status(400).send({ error:{message:error.message} });
    }
  };



  exports.verify= async(req, res) =>{
    try {
      console.log("here")
      console.log(req.params.token)
      const authToken = await Token.findOne({ token:req.params.token });
      console.log("auth token is "+authToken)
      if (!authToken ) {
        return res.status(400).send({ error:{message: "INVALID_TOKEN"} });
      } else {
        const user = await User.findById(authToken.userId);
        user.verified = true;
        await user.save();
        await Token.findByIdAndDelete(authToken._id);
        res.send({ message: "VERIFIED" });
      }
    } catch (err) {
      res.status(400).send({ error:{message: err.message} });
    }   
    }

    exports.getuserNumber = async (req, res) => {
      try {
        console.log("here")
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).send({ error:{message: "USER_NOT_FOUND"} });
        }
        console.log("user phone number is "+user.phoneNumber)
        res.send({ number: user.phoneNumber });
      } catch (error) {
        res.status(400).send({ error:{message: error.message} });
      }
    }
  
    // exporting the middleware