const express = require('express');
const router = express.Router();

const { verifyToken} = require('../middlewares/authentication')

let Enterprise = require('../models/enterprise');
let User = require('../models/user');

router.get('/',(req,res)=>{
    Enterprise.find({})
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
/// PARA CUANDO ES /cosa)parametro=parametro es req.query.parametro
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

        res.json({
            ok:true,
            enterprise:enterpriseDB
        })

    });

})

/// AÑADIR ADMIN A EMPRESA

router.post('/:id/addAdmin', verifyToken, (req,res)=>{
    let idEnterprise = req.params.id;
    ///CHECAR QUE LA EMPRESA EXISTE
    Enterprise.findById(idEnterprise)
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
                err:{
                    message:'No se encontró esa empresa'
                }
            })
        }

        let admins = enterpriseDB.admins;
        
        if (!admins.includes(req.user._id)){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El wey que hizo la peticion no administra esa empresa'
                }
            })
        }

        /// CONFIRMAR QUE EL EMAIL EXISTE EN LA BD
        let newAdminEmail = req.body.email;
        User.findOne({email:newAdminEmail})
        .exec((err, userDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            if(!userDB){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'No se encontró un usuario con ese email'
                    }
                })
            }
            ///VER QUE ESE WEY NO SEA YA ADMIN
            if(admins.includes(userDB._id)){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'Ese wey ya es admin de la empresa'
                    }
                })
            }

            admins.push(userDB._id);

            Enterprise.findByIdAndUpdate({_id:idEnterprise}, {admins}, {new:true})
            .exec((err, newEnterpriseDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }
                if(!newEnterpriseDB){
                    return res.status(400).json({
                        ok:false,
                        err:{
                            message:'No se encontró esa empresa'
                        }
                    })
                }
                res.json({
                    ok:true,
                    enterprise:newEnterpriseDB
                });
            })
        })
    })
})




module.exports = router;