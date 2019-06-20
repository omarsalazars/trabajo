"use strict";
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

// async..await is not allowed in global scope, must use a wrapper
async function sendVerificationMail(email){

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "SMTP.Office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'bolsadetrabajoisc2019@outlook.com', // generated ethereal user
            pass: 'omarcarlos123' // generated ethereal password
        }
    });

    let token = jwt.sign({
        email
    }, process.env.SEED, {expiresIn:500});

    // send mail with defined transport object
    let info = await transporter.sendMail({
    from: 'Pruebas', // sender address
    to: email, // list of receivers
    subject: `Hola, verificate en esta liga`, // Subject line
    text: "Hello world?", // plain text body
    html: `localhost:3000/verify?token=${token}` // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
module.exports = {
    sendVerificationMail
}