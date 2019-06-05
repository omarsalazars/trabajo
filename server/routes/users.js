const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let User = require('../models/user');

router.get('/',(req,res)=>{
    User.find({})
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

router.post('/', async function(req, res){
    let body = req.body;

    let user = new User({
        first_name : body.first_name,
        last_name : body.last_name,
        email : body.email,
        password : bcrypt.hashSync(body.password,10),
        country : body.country,
        phone : body.phone
    });

    await user.save((err, userDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            user:userDB
        })

    });

});

router.delete('/usuario/:id', async function(req, res){

    let id = req.params.id;

    /*let changeStatus={
        status:false
    };

    User.findByIdAndUpdate(id, changeStatus,{new:true},(err, removedUser)=>{

        if(err){
            return res.status(400).json({
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
        res.json({
            ok:true,
            user:removedUser
        });
    });*/

    //FISICA
    await User.findByIdAndRemove(id, (err, removedUser)=>{
        if(err){
            return res.status(400).json({
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
        res.json({
            ok:true,
            user:removedUser
        })

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
        if( !userDB ){
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

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, {expiresIn:60*60*24*30});

        res.json({
            ok:true,
            user:userDB,
            token
        });
    })
})
module.exports = router;