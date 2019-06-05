const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let enterpriseSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
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

enterpriseSchema.plugin(uniqueValidator,{
    message:'There is already an enterprise with that name'
});

/// EN ESTA SIGUIENTE LINEA YA SE CREA EL MODELO USERS
module.exports = mongoose.model('Enterprise', enterpriseSchema);