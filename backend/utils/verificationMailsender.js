
const nodemailer = require('nodemailer');
require('dotenv').config();
exports.sendVerificationMail= async(useremail, token) => {
    console.log("sending mail")
    console.log(process.env.EMAIL);
    console.log(process.env.PASSWORD);  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    const mailOptions = {
        from: process.env.EMAIL,
        to: useremail,
        subject: 'Email Verification',
        text: `welcome `,
        html:`<div><\div><h1>Click on the link to verify your email:</h1><a href="http://localhost:5000/users/verify/${token}">Verify Email</a></div>`,
        };
    
    let info = await transporter
        .sendMail(mailOptions)
        .then((info) => {
            console.log(info.response);
        })
        .catch((err) => {
            console.log(err);
        });
    }