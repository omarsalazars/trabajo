const express = require('express');
const router = express.Router();

const { verifyToken} = require('../middlewares/authentication')

let Enterprise = require('../models/enterprise');

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

router.post('/',verifyToken, async function(req, res){
    let body = req.body;

    let enterprise = new Enterprise({
        name : body.name,
        email : body.email,
        website : body.website,
        phone : body.phone
    });

    await enterprise.save((err, enterpriseDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            enterprise:enterpriseDB
        })

    });

});

module.exports = router;