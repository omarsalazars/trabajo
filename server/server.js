require('./config/config'); //Config solo se importa así al chile

const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var app = express();

var index = require('./routes/index');
var offers = require('./routes/offers');
var users = require('./routes/users');
var enterprises = require('./routes/enterprises');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/', index);
app.use('/offers', offers);
app.use('/users', users);
app.use('/enterprises', enterprises);

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