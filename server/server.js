require('./config/config'); //Config solo se importa así al chile

const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fileUpload = require('express-fileupload');

var app = express();

var index = require('./routes/index');
var offers = require('./routes/offers');
var users = require('./routes/users');
var enterprises = require('./routes/enterprises');
var tests = require('./routes/tests');
var applications = require('./routes/applications');

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '50mb' }));

//app.use(fileUpload({useTempFiles:true}));
app.use(fileUpload());

app.use('/', index);
app.use('/api/offers', offers);
app.use('/api/users', users);
app.use('/api/enterprises', enterprises);
app.use('/tests', tests);
app.use('/api/applications', applications);
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