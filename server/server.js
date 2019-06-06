require('./config/config'); //Config solo se importa así al chile

const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload');

var app = express();

var index = require('./routes/index');
var offers = require('./routes/offers');
var users = require('./routes/users');
var enterprises = require('./routes/enterprises');
var tests = require('./routes/tests');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(fileUpload({useTempFiles:true}));

app.use('/', index);
app.use('/api/offers', offers);
app.use('/api/users', users);
app.use('/api/enterprises', enterprises);
app.use('/tests', tests);
app.use(express.static(path.join(__dirname,'public')));

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