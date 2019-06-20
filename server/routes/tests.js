const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");

router.get('/sendMail',async (req,res)=>{

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "SMTP.Office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'bolsadetrabajoisc2019', // generated ethereal user
      pass: 'omarcarlos123' // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'Carlos', // sender address
    to: "carlos.eao15@gmail.com, omarsalazarx@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  res.send('Enviado');
})

module.exports = router;