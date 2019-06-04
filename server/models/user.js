const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let offerSchema = new Schema({
    id:{
        type:Number,
        required:true
    },
    first_name:{
        type:String,
        unique:true,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    }
});

/// EN ESTA SIGUIENTE LINEA YA SE CREA EL MODELO USERS
module.exports = mongoose.model('User', offerSchema);