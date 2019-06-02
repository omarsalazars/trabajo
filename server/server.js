require('./config/config'); //Config solo se importa así al chile

const express = require ('express');
const mongoose = require('mongoose');

var app = express();

var index = require('./routes/index');
var offers = require('./routes/offers');

app.use('/', index);
app.use('/offers', offers);

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