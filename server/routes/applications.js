const express = require('express');
const router = express.Router();

let Application = require('../models/application');
let Offer = require('../models/offer');

const { verifyToken} = require('../middlewares/authentication');

//GET ALL APPLICATIONS

router.get('/',(req,res)=>{
    Application.find({})
    .populate('offer')
    .populate('user')
    .exec((err, applications)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            applications
        })
    })
})

//POST APPLICATION TAKING USER ID FROM TOKEN IN HEADER

router.post('/',  verifyToken, (req, res)=>{
    let body = req.body;

    let application = new Application({
        user : req.user._id,
        offer : body.offer,
    });

    Application.findOne({user:application.user, offer:application.offer}, (err, applicationDB)=>{
        if(err){
            return res.json({
                err
            })
        }
        if(applicationDB){
            return res.json({
                err:{
                    message: 'El usuario ya aplicó para esa oferta'
                }
            })
        }

        application.save((err, applicationDB)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }
            if(!applicationDB){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                application:applicationDB
            })
        });
    })

})

//GET APPLICATIONS BY ENTERPRISE ID


router.get('/enterprise/:id', (req, res)=>{
    let id = req.params.id;
    let enterpriseOffers = [];

    Offer.find({enterprise:id})
    .exec((err, offersDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!offersDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        for(var i=0; i<offersDB.length; i++){
            enterpriseOffers.push(offersDB[i]._id);
        }
        Application.find({offer: {$in :enterpriseOffers}})
        .populate({path:'offer', populate:{path:'enterprise', select:'name'}})
        .populate('user', 'name')
        .exec((err, applicationsDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            if(!applicationsDB){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                applications:applicationsDB
            })
        })
    })
})

//GET APPLICATIONS BY USER ID

router.get('/user/:id', (req, res)=>{
    let id = req.params.id;

    Application.find({user:id})
        .populate('user', 'email')
        .populate('offer')
        .exec((err, applicationsDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!applicationsDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            applications:applicationsDB
        })
    })
})


//GET APPLICATIONS BY OFFER ID

router.get('/offer/:id', (req, res)=>{
    let id = req.params.id;

    Application.find({offer:id})
        .populate('user', 'email')
        .populate('offer')
        .exec((err, applicationsDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(applicationsDB.length==0 || !applicationsDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"No hay aplicaciones para esa oferta"
                }
            })
        }
        res.json({
            ok:true,
            applications:applicationsDB
        })
    })
})

/// GET SINGLE APPLICATION BY ID

router.get('/:id', (req, res)=>{
    let id = req.params.id;

    Application.findById(id)
        .populate('user', 'email')
        .populate('offer')
        .exec((err, applicationDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!applicationDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            application:applicationDB
        })
    })
})


module.exports = router;