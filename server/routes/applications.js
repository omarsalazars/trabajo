const express = require('express');
const router = express.Router();

let Application = require('../models/application');

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

router.post('/', async (req, res)=>{
    let body = req.body;

    let application = new Application({
        user : body.user,
        offer : body.offer,
    });

    await Application.findOne({user:application.user, offer:application.offer}, (err, applicationDB)=>{
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

module.exports = router;