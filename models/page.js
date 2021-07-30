const mongoose = require('mongoose');


const pageSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    content:{
        type:String,
    },
    owner:{
        type:String
    }
},{
    timestamps:true
})

const Page = new mongoose.model('Page',pageSchema);
module.exports = Page;