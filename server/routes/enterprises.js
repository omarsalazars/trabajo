const express = require('express');
const router = express.Router();

const { verifyToken} = require('../middlewares/authentication')

let Enterprise = require('../models/enterprise');
let User = require('../models/user');

router.get('/',(req,res)=>{
    Enterprise.find({})
    .populate('admins')
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


/// OBTENER UNA EMPRESA ADMIN A EMPRESA

/// CUANDO LAS COSAS VIENEN TIPO pagina/api/cosa/parametro se jala por req.paras.parametro
/// PARA CUANDO ES /cosa?parametro=parametro es req.query.parametro
router.get('/:id', (req,res)=>{
    let id = req.params.id;

    Enterprise.findById(id)
    .populate('admins')
    .exec((err, enterpriseDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!enterpriseDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            enterprise:enterpriseDB
        })
    })
})


/// CREAR EMPRESA
router.post('/',verifyToken, async function(req, res){
    let body = req.body;

    let enterprise = new Enterprise({
        name : body.name,
        email : body.email,
        website : body.website,
        phone : body.phone,
        admins : req.user._id
    });

    await enterprise.save((err, enterpriseDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        User.findByIdAndUpdate(req.user._id,{$addToSet:{managed_enterprises:enterpriseDB._id}}, {new:true})
        .exec((err, userDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                enterprise:enterpriseDB,
                user:userDB
            })
        })

    });
})

/// AÑADIR ADMIN A EMPRESA

router.post('/:id/addAdmin', verifyToken, async (req,res)=>{
    let enterpriseId = req.params.id;
    let userId = req.user._id;

    //VER QUE EL WEY HACIENDO LA PETICION SEA ADMIN DE ESA EMPRESA
    User.findOne({_id:userId, managed_enterprises:enterpriseId}, (err, userDB)=>{
        if(err){
            return res.json({
                err
            })
        }
        if(!userDB){
            return res.json({
                err:{
                    message: 'El usuario no administra esa empresa'
                }
            })
        }
    })

    let newAdminEmail = req.body.email;

    User.findOneAndUpdate({email:newAdminEmail}, {$addToSet:{managed_enterprises:enterpriseId} }, {new:true},(err, userDB)=>{
        if(err){
            return res.json({
                err
            })
        }
        if(userDB===null){
            return res.json({
                err:{
                    message: 'No existe un usuario con ese correo'
                }
            })
        }
        Enterprise.findOneAndUpdate({_id:enterpriseId}, {$addToSet:{admins:userDB._id} }, {new:true},(err, enterpriseDB)=>{
            if(err){
                return res.json({
                    err
                })
            }
            if(enterpriseDB===null){
                return res.json({
                    err:{
                        message: 'No existe un usuario con ese correo'
                    }
                })
            }
            res.json({
                enterpriseDB,
                userDB
            })
        })
    })
    
    
})




module.exports = router;