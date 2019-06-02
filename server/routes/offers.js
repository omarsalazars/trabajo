const express = require('express');
const router = express.Router();

let Offer = require('../models/offer');

router.get('/',(req,res)=>{
    Offer.find({})
    .exec((err, offers)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            offers
        })
    })
})

module.exports = router;