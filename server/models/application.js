const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let applicationSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    offer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    },
    stage:{
        type:Number,
        required:true,
        // 0 just received, 1 enterprise interested, ready for interviews, 2 after interviews, awaiting confirmation
        default: 0
    },
    status:{
        type:Number,
        required:true,
        //0 for going, 1 for completed
        default:0
    },
    result:{
        type:Boolean,
    }   
});


/// EN ESTA SIGUIENTE LINEA YA SE CREA EL MODELO USERS
module.exports = mongoose.model('Application', applicationSchema);