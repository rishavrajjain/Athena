const express = require('express');
const sgMail = require('@sendgrid/mail');
const router = express.Router();
const auth = require('../middleware/auth');
const Cards = require('../models/cards');
var CryptoJS=require('crypto-js');
const axios = require('axios');
const Page = require('../models/page');
const User = require('../models/user');

var access_key = `${process.env.RAPYD_ACCESS_KEY}`
var secret_key = `${process.env.RAPYD_SECRET_KEY}`;






sgMail.setApiKey(process.env.SENDGRID_API_KEY);




router.post('/send-gift-card/init',auth,async(req,res)=>{

    try{

        const card = new Cards({
            fromEmail:req.user.email,
            fromName:req.user.name,
            toName:req.body.name,
            toEmail:req.body.email,
            amount:req.body.amount,
            code:req.body.code
        })

        await card.save();

        

        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + 1);
        var unix = Math.round(date/1000);

        const body = {
            amount: req.body.amount,
            complete_payment_url: `${process.env.UI_BASE_URL}/${card._id}/payment/complete`,
            country: "US",
            currency: "USD",
            ewallet:process.env.RAPYD_WALLET_ID,
            error_payment_url: `${process.env.UI_BASE_URL}/${card._id}/payment/error`,
            complete_checkout_url:`${process.env.UI_BASE_URL}/${card._id}/payment/complete`,
            error_checkout_url:`${process.env.UI_BASE_URL}/${card._id}/payment/error`,
            cardholder_preferred_currency: true,
            language: "en",
            metadata: {
                merchant_defined: true
            },
            payment_method_types_include: [
                "us_visa_card",
                "us_mastercard_card",
                "us_atmdebit_card"
            ],
            expiration: unix,
            payment_method_types_exclude: []
        }
    
        var http_method = 'post';      
        var url_path = '/v1/checkout';    
        var salt = CryptoJS.lib.WordArray.random(12); 
        var timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
    
    
    
        var to_sign = http_method + url_path + salt + timestamp + access_key + secret_key + JSON.stringify(body);
    
        var signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret_key));
    
        signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));
    
        const config = {
            headers:{
                access_key:access_key,
                timestamp:timestamp,
                salt:salt,
                signature:signature
            }
        }
        
        axios.post(process.env.RAPYD_BASE_URL+'/v1/checkout',body,config).then(async result=>{
            
            res.send(result.data)
        }).catch(err=>{
            console.log(err);
            console.log(err.response.data)
            res.send(err);
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            data:{
                message:'Server Error'
            }
        })
    }
})

router.get('/direct/:id/payment/complete',async(req,res)=>{
    const id = req.params.id;

    try{


        const card = await Cards.findOne({_id:id});


        if(card.sent){
            return res.status(409).json({
                data:{
                    message:'Card already sent'
                }
            })
        }
        card.paymentStatus = 'COMPLETED'
        card.sent = true;
        await card.save();

        const data = {
            "gift": {
                 "action": "order",
                 "apikey": process.env.BLINKSKY_API_KEY,
                 "sender": card.fromEmail,
                 "from": "14045551212",
                 "dest": card.toEmail,
                 "code": card.code,
                 "amount": Number(card.amount)-0.99,
                 "postal": "110000",
                 "msg": "Awesome Gift Easy",
                 "reference": card._id.toString(),
                 "handle_delivery": false
            }
        }

        const result = await axios.post('https://api.blinksky.com/api/v1/send',data);

        const msg = {
            to: card.fromEmail,
            from: 'abhayrpatel10@gmail.com', 
            subject: 'Gift Easy - Gift card sent successfully',
            text: 'Gift card successfully sent',
            html:`<head>
            <link href="https://fonts.googleapis.com/css?family=Tomorrow:300,400,700&display=swap" rel="stylesheet"> 
    </head>
    <body style="color: black ;font-family: 'Tomorrow', sans-serif;">
        <div style="margin-top:15vh">
        <center>
           
            <h1 style="font-size:xx-large; font-optical-sizing: 10;">Gift Easy</h1>
            <h3>
                <br><br>

                
                <br>
                <p>Your gift card for USD ${Number(card.amount) - 0.99} has been sent to ${card.fromName}</p>

                
                
                
            
    
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
                    message:'Successfull'
                }
            })
            })
            .catch((error) => {
              console.error(error)
              console.log(error.response.body)
            })
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            data:{
                message:'Server Error'
            }
        })
    }
})


router.post('/send-gift-card/:id/init',async(req,res)=>{

    

    try{
        const page = await Page.findOne({_id:req.params.id});
        const user = await User.findOne({_id:page.owner})
        const card = new Cards({
            fromEmail:req.body.email,
            fromName:req.body.name,
            toName:user.name,
            toEmail:user.email,
            amount:req.body.amount,
            code:req.body.code
        })

        await card.save();

        

        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + 1);
        var unix = Math.round(date/1000);

        const body = {
            amount: req.body.amount,
            complete_payment_url: `${process.env.UI_BASE_URL}/${card._id}/payment/complete`,
            country: "US",
            currency: "USD",
            ewallet:process.env.RAPYD_WALLET_ID,
            error_payment_url: `${process.env.UI_BASE_URL}/${card._id}/payment/error`,
            complete_checkout_url:`${process.env.UI_BASE_URL}/${card._id}/payment/complete`,
            error_checkout_url:`${process.env.UI_BASE_URL}/${card._id}/payment/error`,
            cardholder_preferred_currency: true,
            language: "en",
            metadata: {
                merchant_defined: true
            },
            payment_method_types_include: [
                "us_visa_card",
                "us_mastercard_card",
                "us_atmdebit_card"
            ],
            expiration: unix,
            payment_method_types_exclude: []
        }
    
        var http_method = 'post';      
        var url_path = '/v1/checkout';    
        var salt = CryptoJS.lib.WordArray.random(12); 
        var timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
    
    
    
        var to_sign = http_method + url_path + salt + timestamp + access_key + secret_key + JSON.stringify(body);
    
        var signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret_key));
    
        signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));
    
        const config = {
            headers:{
                access_key:access_key,
                timestamp:timestamp,
                salt:salt,
                signature:signature
            }
        }
        
        axios.post(process.env.RAPYD_BASE_URL+'/v1/checkout',body,config).then(async result=>{
            
            res.send(result.data)
        }).catch(err=>{
            console.log(err);
            console.log(err.response.data)
            res.send(err);
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            data:{
                message:'Server Error'
            }
        })
    }
})




module.exports = router;