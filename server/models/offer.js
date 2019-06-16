const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let offerSchema = new Schema({
    enterprise:{
        type: Schema.Types.ObjectId,
        ref: 'Enterprise'
    },
    position:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    travel:{
        type:Boolean,
        required:true
    }
});


/// EN ESTA SIGUIENTE LINEA YA SE CREA EL MODELO OFFERS
module.exports = mongoose.model('Offer', offerSchema);