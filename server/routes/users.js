const express = require('express');
const router = express.Router();

let Offer = require('../models/user');

router.get('/',(req,res)=>{
    Offer.find({})
    .exec((err, users)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            users
        })
    })
})

module.exports = router;