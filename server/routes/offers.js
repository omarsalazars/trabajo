const express = require('express');
const router = express.Router();

let Offer = require('../models/offer');

router.get('/',(req,res)=>{
    Offer.find({})
    .populate('enterprise', 'name')
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

router.post('/', function(req, res){
    let body = req.body;

    let offer = new Offer({
        enterprise: body.enterprise,
        position: body.position,
        description:body.description,
        salary:parseInt(body.salary),
        travel:body.travel
    });

    offer.save((err, offerDB)=>{

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

//GET OFFERS BY ENTERPRISE ID
router.get('/enterprise/:id', async (req, res)=>{
    let id = req.params.id;

    await Offer.find({enterprise:id})
    .populate('enterprise', 'name')
    .exec( (err, offers)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!offers){
            return res.status(400).json({
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