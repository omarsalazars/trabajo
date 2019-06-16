const express = require('express');
const router = express.Router();

let Offer = require('../models/offer');

router.get('/',(req,res)=>{
    Offer.find({})
    .populate('enterprise')
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

router.post('/', async function(req, res){
    let body = req.body;

    let offer = new Offer({
        enterprise: body.enterprise,
        position: body.position,
        description:body.description,
        salary:body.salary,
        travel:body.travel
    });

    await offer.save((err, offerDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            offer:offerDB
        })

    });

});

module.exports = router;