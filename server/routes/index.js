const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

let User = require('../models/user');

router.get('/verify', (req,res)=>{
    let token = req.query.token;

    jwt.verify(token, process.env.SEED,(err, decoded)=>{
        if(err){
            return res.status(401).json({
                //ok:false,
                token: token,
                err
            })
        }
        User.findOneAndUpdate({email:decoded.email}, {verified:true}, {new:true})
        .exec((err,userDB)=>{
            if(err){
                return res.json({
                    err
                })
            }
            if(!userDB){
                return res.json({
                    err:{
                        message:'Valio verga el usuario'
                    }
                })
            }
            console.log('Aqui va el redirect');
            res.redirect('index.html');
        })
    })
})

module.exports = router;