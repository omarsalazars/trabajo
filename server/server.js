require('./config/config'); //Config solo se importa así al chile

const express = require ('express');
const mongoose = require('mongoose');

var app = express();

app.get('/',(req,res)=>{
    res.send('El beris se la come');
})


let Offer = require('./models/offer');

app.get('/offers',(req,res)=>{
    Offer.find({})
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


mongoose.connect(process.env.URLDB,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false
})
.then(db=>console.log(`db is connected`))
.catch(err=>console.log(err));

app.listen(process.env.PORT, ()=>{
    console.log('Escuchando puerto', process.env.PORT);
})