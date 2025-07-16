const express=require('express');
const app=express();
const mongoose=require('mongoose');
const User=require('./models/user.model');
const cors=require('cors');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

app.use(cors());
app.use(express.json())
mongoose.connect('mongodb://localhost:27017/ONLINEIDE')

app.get('/',(req,res)=>{
    res.send("<h1>Hello World</h1>");
})

app.post('/api/login',async (req,res)=>{
    let data=req.body;
    try{
        const user=await User.findOne({email:data.email});
        if(user){
            let PassComp=await bcrypt.compare(user.password,data.pwd);
            if(PassComp){
                console.log(user);
                res.json({status:'ok'})
            }
            else{
                res.json({status:'error',error:'Invalid Credientials'})
            }
        }else{
            res.json({status:'error',error:'Email Doesnt Exist'})
        }
    }
    catch{
        res.json({status:'error',error:'Network Issues'})

    }
})

app.post('/api/register',async (req,res)=>{
    let data=req.body;
    try{
        const temp=await User.findOne({email:data.email});
        if(temp){
            res.json({status:'error',error:'Email In Use'});
        }else{
            const newPassword=await bcrypt.hash(data.pwd,10);
            const user=await User.create({
                name:data.name,
                email:data.email,
                password:newPassword,
            })
            res.json({status:'ok'});
        }
    }
    catch{
        res.json({status:'error',error:'Network Issues'});
    }

})

app.listen(8000,()=>{
    console.log(`Port is Running At http://localhost:8000`)
})