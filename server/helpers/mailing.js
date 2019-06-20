"use strict";
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

// async..await is not allowed in global scope, must use a wrapper
async function sendApplicationUpdateMail(email, fullname, description){

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "SMTP.Office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.EMAILPASSWD // generated ethereal password
        }
    });


    // send mail with defined transport object
    let info = await transporter.sendMail({
    from: 'Pruebas', // sender address
    to: email, // list of receivers
    subject: `Hola, Tenemos noticias sobre tu aplicacion tal`, // Subject line
    text: `${fullname}, ${description}. Revisa nuestro sitio para ver más detalles`, // plain text body
    html:  `${fullname}, ${description}. Revisa nuestro sitio para ver más detalles` // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


// async..await is not allowed in global scope, must use a wrapper
async function sendNewInterestedMail(email, enterpriseName){

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "SMTP.Office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.EMAILPASSWD // generated ethereal password
        }
    });

    let token = jwt.sign({
        email
    }, process.env.SEED, {expiresIn:500});

    // send mail with defined transport object
    let info = await transporter.sendMail({
    from: 'Pruebas', // sender address
    to: email, // list of receivers
    subject: `Hola, Hay un nuevo interesado en una de tus vacantes`, // Subject line
    text: `${enterpriseName}, Hay un interesado en una de tus vacantes, revisa el perfil de tu empresa`, // plain text body
    html:  `${enterpriseName}, Hay un interesado en una de tus vacantes, revisa el perfil de tu empresa` // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


// async..await is not allowed in global scope, must use a wrapper
async function sendVerificationMail(email, liga){

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "SMTP.Office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.EMAILPASSWD // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
    from: 'Bolsa de Trabajo', // sender address
    to: email, // list of receivers
    subject: `Hola, verificate en esta liga`, // Subject line
    text: liga, // plain text body
    html: liga // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


module.exports = {
    sendVerificationMail,
    sendNewInterestedMail,
    sendApplicationUpdateMail
}