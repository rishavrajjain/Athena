const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    tokens:[
        {
        token:{
            type:String
        }
    }],
    pages : [],
    verified:{
        type:Boolean,
        default:false
    }
    
},{
    timestamps:true
})


const User=mongoose.model('User',userSchema);
module.exports=User;