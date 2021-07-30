const express = require('express');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');
const router = express.Router();

const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');
var saltPassword = bcrypt.genSaltSync(10);



sgMail.setApiKey(process.env.SENDGRID_API_KEY);



router.post('/signup',async(req,res)=>{
    const {name,email} = req.body

    try{
        const userExists = await User.findOne({email:email});
        if(userExists){
            res.status(409).json({
                data:{
                    message:'User Exists'
                }
            })
        }else{
            var hash = bcrypt.hashSync(req.body.password, saltPassword);
            const user = new User({
                name:req.body.name,
                email:req.body.email,
                password:hash,
            });
            await user.save();
            const verification_url=`${process.env.UI_BASE_URL}/user/verify/`+user._id;
            const msg = {
                to: user.email,
                from: 'abhayrpatel10@gmail.com', 
                subject: 'Verify Your Account Gift Easy',
                html:`<head>
                <link href="https://fonts.googleapis.com/css?family=Tomorrow:300,400,700&display=swap" rel="stylesheet"> 
        </head>
        <body style="color: black ;font-family: 'Tomorrow', sans-serif;">
            <div style="margin-top:15vh">
            <center>
               
                <h1 style="font-size:xx-large; font-optical-sizing: 10;">Gift Easy</h1>
                <h3>
                    <br><br>

                    
                    
                    <a href="${verification_url}" style="color:rgb(83, 157, 221)">Click this link to Verify your account</a> 
                    <br><br><br>

                    <p>If the above link does not work.Please paste this URL in your browser</p>
                    <br>
                    <p>${verification_url}</p>

                    
                    
                    
                
        
            </center>
        </div>
        </body>`
                
              }
              sgMail
                .send(msg)
                .then(() => {
                  console.log('Email sent')
                  res.status(200).json({
                    data:{
                        message:'User Created successfully'
                    }
                })
                })
                .catch((error) => {
                  console.error(error)
                  console.log(error.response.body)
                })
        }

        

    }catch(err){
        res.status(500).json({
            data:{
                message:'Error'
            }
        })
    }

})


router.get('/verify/:id',async(req,res)=>{
    const id = req.params.id;

    try{
        const user = await User.findOne({_id:id});
        user.verified = true;
        await user.save();
        res.status(200).json({
            data:{
                message:'User Verified'
            }
        })
    }catch(err){
        res.status(500).json({
            data:{
                message:'Server Error'
            }
        })
    }
})

router.post('/resendVerificationEmail',async(req,res)=>{
    const email = req.body.email;

    try{
        const user = await User.findOne({email:email});
        const verification_url=`${process.env.UI_BASE_URL}/user/verify/`+user._id;
        console.log(verification_url)
            const msg = {
                to: user.email,
                from: 'abhayrpatel10@gmail.com', 
                subject: 'Verify Your Account Gift Easy',
                html:`<head>
                <link href="https://fonts.googleapis.com/css?family=Tomorrow:300,400,700&display=swap" rel="stylesheet"> 
        </head>
        <body style="color: black ;font-family: 'Tomorrow', sans-serif;">
            <div style="margin-top:15vh">
            <center>
               
                <h1 style="font-size:xx-large; font-optical-sizing: 10;">Gift Easy</h1>
                <h3>
                    <br><br>

                    
                    
                    <a href="${verification_url}" style="color:rgb(83, 157, 221)">Click this link to Verify your account</a> 
                    <br><br><br>

                    <p>If the above link does not work.Please paste this URL in your browser</p>
                    <br>
                    <p>${verification_url}</p>

                    
                    
                    
                
        
            </center>
        </div>
        </body>`
                
              }
              sgMail
                .send(msg)
                .then(() => {
                  console.log('Email sent')
                  res.status(200).json({
                    data:{
                        message:'Mail Sent Successfully'
                    }
                })
                })
                .catch((error) => {
                  console.error(error)
                  console.log(error.response.body)
                })

    }catch(err){
        res.status(500).json({
            data:{
                message:'Server Error'
            }
        })
    }
})


router.post('/login',async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;

    try{
        const user= await User.findOne({email});
        if(!user){
            res.status(404).json({
                data:{
                    message:'User Not found.Please register first.'
                }
            })
        }
        if(!user.verified){
            res.status(403).send('Email verification pending.')
        }
        console.log(user);
        if(bcrypt.compareSync(password, user.password)){
            const token = await jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);
            user.tokens=user.tokens.concat({token})
            await user.save();

            
            const userData = {
                name:user.name,
                email:user.email,
                pages:user.pages,
                token:token,
            }
            console.log(user);
            
            res.status(200).json({
                data:userData
            })
            
            

        }else{
            res.status(401).json({
                data:{
                    message:'Invalid Credentials'
                }
            })
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            data:err
        })
    }


})


















router.post('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.status(200).json({
            data:{
                message:'Logged out successfully'
            }
        })
    }catch(e){
        res.status(500).json({
            data:{
                message:'Internal Server Error'
            }
        })
    }
})







module.exports=router;