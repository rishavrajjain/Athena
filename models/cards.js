const mongoose = require('mongoose');


const cardsSchema = new mongoose.Schema({
    fromName:{
        type:String
    },
    fromEmail:{
        type:String
    },
    toName:{
        type:String
    },toEmail:{
        type:String
    },
    code:{
        type:String
    },
    amount:{
        type:Number
    },
    paymentStatus:{
        type:String,
        default:'INITIATED'
    },
    sent:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
})

const Cards = new mongoose.model('Cards',cardsSchema);
module.exports = Cards;