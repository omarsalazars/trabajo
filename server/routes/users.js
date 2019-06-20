const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var multer = require('multer');

const { verifyToken} = require('../middlewares/authentication');
const { sendVerificationMail} = require('../helpers/mailing')


const bcrypt = require('bcrypt');

let User = require('../models/user');
let Application = require('../models/application');
let Enterprise = require('../models/enterprise');


router.get('/',(req,res)=>{
    User.find({active:true})
        .exec((err, users)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            users
        })
    })
})

router.get('/:id', (req,res)=>{
    let id = req.params.id;

    User.findById(id)
        .populate('managed_enterprises')
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
                err
            })
        }
        res.json({
            ok:true,
            user:userDB
        })
    })
})

router.post('/', function(req, res){
    let body = req.body;

    let user = new User({
        first_name : body.first_name,
        last_name : body.last_name,
        email : body.email,
        password : bcrypt.hashSync(body.password,10),
        country : body.country,
        phone : body.phone
    });

    user.save((err, userDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        sendVerificationMail(userDB.email);
        res.json({
            ok:true,
            user:userDB
        })

    });

});

// BAJA LOGICA A USUARIO POR ID
router.delete('/:id', function(req, res){

    let id = req.params.id;

    //SE QUITAN TODAS LAS EMPRESAS DE LAS EMPRESAS QUE EL WEY YA ADMINISTRABA

    User.findByIdAndUpdate(id, {active:false, managed_enterprises:[]},{new:true},(err, removedUser)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!removedUser){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'User not found'
                }
            })
        }
        ///BAJA FISICA A LAS APLICACIONES QUE HABIA HECHO ESE USUARIO
        Application.deleteMany({user:id})
        .exec((err, removedApplications)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            if(!removedApplications){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'No se borraron aplicaciones'
                    }
                })
            }
        })

        //QUITAR AL USUARIO DE LAS EMPRESAS QUE ADMINISTRABA

        Enterprise.updateMany({admins:id}, {$pull:{admins:id}})
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
                        message:'No se borró nada'
                    }
                })
            }
        })
        
        
        res.json({
            ok:true,
            user:removedUser
        });
    });
});

router.post('/login', (req, res)=>{
    let body = req.body;

    User.findOne({email:body.email}, (err, userDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if( !userDB || !userDB.active ){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'(Usuario) o contraseña incorrectos'
                }
            })
        }

        if(!bcrypt.compareSync( body.password, userDB.password)){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario o (contraseña) incorrectos'
                }
            })
        }
        if(!userDB.verified){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Por favor verifica tu cuenta para iniciar sesión'
                }
            })
        }

        let token = jwt.sign({
            user:userDB
        }, process.env.SEED, {expiresIn:60*60*24*30});

        res.json({
            ok:true,
            user:userDB,
            token
        });
    })
})

router.post('/upload/:folder', [verifyToken, multer({dest: 'public/uploads/images'}).single('file') ], (req, res)=>{

    console.log(__dirname);

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
    let folder = req.params.folder;
    let ext = file.name.split('.');
    ext = ext[ext.length-1];  

    let validImageExtensions = ['png', 'jpg'];

    if(folder=='images' && !validImageExtensions.includes(ext)){
        return res.status(400).json({
            ok:false,
            err:{
                message:'La extensión de la imagen no es valida hdp'
            }
        })
    }
    if(folder=='curriculums' && ext != 'pdf'){
        return res.status(400).json({
            ok:false,
            err:{
                message:'El curriculum solo tiene que ser pdf'
            }
        })
    }

    ///CAMBIAR NOMBRE AL ARCHIVO

    let fileName = `${req.user._id}.${ext}`;
    // Use the mv() method to place the file somewhere on your server

    file.mv(`${__dirname}/../../server/public/uploads/users/${folder}/${fileName}`, (err)=>{
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


router.put('/:id', function(req, res){
    let id = req.params.id;
    let body = req.body;
    User.findByIdAndUpdate(id, {
            $set:{
                first_name:body.first_name,
                last_name:body.last_name,
                country:body.country,
                phone:body.phone
            }
        },{new:true,runValidators:true} ,(err, userDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            user: userDB
        });
    });
});

module.exports = router;