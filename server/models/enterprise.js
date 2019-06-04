const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let offerSchema = new Schema({
    id:{
        type:Number,
        unique:true,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    website:{
        type:String,
        required:false
    },
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    }
});

/// EN ESTA SIGUIENTE LINEA YA SE CREA EL MODELO USERS
module.exports = mongoose.model('Enterprise', offerSchema);