const express = require('express');
const router = express.Router();
const multer = require('multer');

let Application = require('../models/application');
let Offer = require('../models/offer');

const { verifyToken} = require('../middlewares/authentication');

//GET ALL APPLICATIONS

router.get('/',(req,res)=>{

    Application.find()
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
        .populate({path:'offer', populate:{path:'enterprise'}})
        .populate('user')
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
        .populate('user')
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
        .populate('user')
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
        .populate('user')
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

router.put('/:id/proceed', (req, res)=>{
    let id = req.params.id;

    Application.findOneAndUpdate({$and:[{_id:id}, { status: 1 }]} , {$inc:{stage:1}}, {new:true})
    .exec((err, applicationDB)=>{
        if(err){
            return res.json({
                ok:false,
                err
            })
        }
        if(!applicationDB){
            return res.json({
                ok:false,
                err
            })
        }

        let description;
        switch(applicationDB.stage){
            case 0:
                description="En espera de confirmación por parte de empresa";
                break;
            case 1:
                description="Preguntas enviadas";
                break;
            case 2:
                description="Ya métanse al videochat";
                break;
            case 3:
                description="Ya le dieron el puesto al wey"
                break;
        }

        if(applicationDB.stage==3){
            Application.findByIdAndUpdate(id, {status:0}, {new:true})
            .exec((err, finishedApplication)=>{
                if(err){
                    return res.json({
                        ok:false,
                        err
                    })
                }
                if(!finishedApplication){
                    return res.json({
                        ok:false,
                        err
                    })
                }
                return res.json({
                    finishedApplication,
                    description
                })
            })
        }
        else{
            return res.json({
                applicationDB,
                description
            })
        }

        
    })

})

router.put('/:id/finish', (req, res)=>{
    let id = req.params.id;
    
    Application.findByIdAndUpdate(id, {status:0}, {new:true})
    .exec((err, applicationDB)=>{
        if(err){
            return res.json({
                ok:false,
                err
            })
        }
        if(!applicationDB){
            return res.json({
                ok:false,
                err
            })
        }
        return res.json({
            applicationDB
        })
    })
})

router.delete('/:id', (req, res)=>{
    Application.findByIdAndDelete(id)
    .exec((err, applicationDB)=>{
        if(err){
            return json.status(500).json({
                ok:false,
                err
            })
        }
        if(!applicationDB){
            return json.status(400).json({
                ok:false,
                err:{
                    message:"No se encontro esa oferta"
                }
            }) 
        }
        res.json({
            application:applicationDB
        })
    })
})

//5d09d8df3d5f5339a48544d9
//SUBIR RESPUESTAS DE APLICACION (CUESTIONARIO
router.put('/:id/upload/answers', multer({dest: 'uploads/applications/answers'}).single('file'), (req, res)=>{

    if (Object.keys(req.files).length == 0) {
        return res.status(400)
            .json({
            ok:false, 
            err:{
                message:'No files were uploaded.'
            }
        });
    }

    let file = req.files.file;
    let ext = file.name.split('.');
    ext = ext[ext.length-1];  

    if(ext != 'pdf'){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Las respuestas solo puede ser pdf'
            }
        })
    }

    ///CAMBIAR NOMBRE AL ARCHIVO

    let fileName = `${req.params.id}.${ext}`;
    // Use the mv() method to place the file somewhere on your server

    file.mv(`${__dirname}/../../server/uploads/applications/answers/${fileName}`, (err)=>{
        if (err)
            return res.status(500).json({
                ok:false,
                err
            })

        //AQUI archivo CARGADo

        res.json({
            ok:true, 
            message:'File uploaded!'
        });
    });
});

module.exports = router;