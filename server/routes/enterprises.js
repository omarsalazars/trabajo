const express = require('express');
const router = express.Router();

let Offer = require('../models/enterprises');

router.get('/',(req,res)=>{
    Offer.find({})
    .exec((err, enterprises)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            enterprises
        })
    })
})

module.exports = router;