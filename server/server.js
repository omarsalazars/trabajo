require('./config/config'); //Config solo se importa así al chile

const express = require ('express');

var app = express();

app.get('/',(req,res)=>{
    res.send('El beris se la come');
})

app.listen(process.env.PORT, ()=>{
    console.log('Escuchando puerto', process.env.PORT);
})