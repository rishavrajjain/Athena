const express = require('express');
const router = express.Router();
const axios = require('axios');

const Page = require('../models/page');
const User = require('../models/user');
const auth = require('../middleware/auth');


router.post('/create-page',auth,async(req,res)=>{
    try{
        const page = new Page(req.body);
        page.owner = req.user._id;
        await page.save();

        req.user.pages.push(page._id);
        await req.user.save();
        res.status(200).json({
            data:page
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

router.get('/pages',auth,async(req,res)=>{
    try{
        const pages = await Page.find({owner:req.user._id})
        res.status(200).json({
            data:pages
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

router.get('/page/:id',async(req,res)=>{
    try{
        const page = await Page.findOne({_id:req.params.id});
        res.status(200).json({
            data:page
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

router.patch('/page/:id',auth,async(req,res)=>{
    try{
        const page = await Page.findOne({_id:req.params.id});
        page.content = req.body.content;
        page.title = req.body.title;
        await page.save();
        res.status(200).json({
            data:{
                message:'Updated Successfully'
            }
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

router.delete('/page/:id',auth,async(req,res)=>{
    try{
        await Page.findByIdAndDelete({_id:req.params.id});
        res.status(200).json({
            data:{
                message:'Page Deleted'
            }
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            data:'Server Error'
        })
    }
})

// router.post('/send-gift-card/:id',async(req,res)=>{
//     try{
//         const page = await Page.findOne({_id:req.params.id});
//         const user = page.owner;

//         const data = {
//             "gift": {
//                  "action": "order",
//                  "apikey": process.env.BLINKSKY_API_KEY,
//                  "sender": "Abhay Patel.",
//                  "from": "14045551212",
//                  "dest": user.email,
//                  "code": req.body.code,
//                  "amount": req.body.amount,
//                  "postal": "110000",
//                  "msg": "Thank You !! You are awesome",
//                  "reference": user._id.toString(),
//                  "handle_delivery": false
//             }
//         }

//         const result = await axios.post('https://api.blinksky.com/api/v1/send',data);
//         res.status(200).json({
//             data:{
//                 message:'Gift Card Sent'
//             }
//         })

//     }catch(err){
//         console.log(err);
//         res.status(500).json({
//             data:{
//                 message:'Server Error'
//             }
//         })
//     }
// })



// router.post('/direct/send-gift-card/',auth,async(req,res)=>{
//     try{
        

//         const data = {
//             "gift": {
//                  "action": "order",
//                  "apikey": process.env.BLINKSKY_API_KEY,
//                  "sender": req.user.email,
//                  "from": "14045551212",
//                  "dest": req.body.email,
//                  "code": req.body.code,
//                  "amount": req.body.amount,
//                  "postal": "110000",
//                  "msg": "Thank You !! You are awesome",
//                  "reference": req.user._id.toString(),
//                  "handle_delivery": false
//             }
//         }

//         const result = await axios.post('https://api.blinksky.com/api/v1/send',data);
//         res.status(200).json({
//             data:{
//                 message:'Gift Card Sent'
//             }
//         })

//     }catch(err){
//         console.log(err);
//         res.status(500).json({
//             data:{
//                 message:'Server Error'
//             }
//         })
//     }
// })


router.get('/catalog',async(req,res)=>{

    try{
        const data = {
            "service": {
                 "apikey": process.env.BLINKSKY_API_KEY,
            }
        }
    
        const result = await axios.post('https://api.blinksky.com/api/v1/catalog',data);
        res.status(200).json({
            data:result.data
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