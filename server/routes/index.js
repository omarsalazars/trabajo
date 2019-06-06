const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

let User = require('../models/user');

router.get('/verify', (req,res)=>{
    let token = req.query.token;

    jwt.verify(token, process.env.SEED,(err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err
            })
        }
        User.findOneAndUpdate({email:decoded.email}, {verified:true}, {new:true})
        .exec((err,userDB)=>{
            res.redirect('localhost:3000/login');
        })
    })
})

module.exports = router;