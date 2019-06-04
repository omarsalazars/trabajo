const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let userSchema = new Schema({
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
        unique:true,
        required:true
    },
    password:{
        required:true,
        type:String
    },
    phone:{
        type:String,
        required:true
    },
    verified:{
        required:true,
        type: Boolean,
        default: false
    }
});

userSchema.plugin(uniqueValidator,{
    message:'Email already in use'
});

/// EN ESTA SIGUIENTE LINEA YA SE CREA EL MODELO USERS
/// SI SE HACE UN POST DESDE EL CODIGO LA COLECCION BUSCADA ES EL PRIMER ARGUMENTO
/// EN MINUSCULAS Y CON UNA S AL FINAL
module.exports = mongoose.model('User', userSchema);