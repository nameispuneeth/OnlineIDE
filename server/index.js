const express=require('express');
const app=express();
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const mongoose=require('mongoose');
const User=require('./models/user.model');
const cors=require('cors');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const { ObjectId } = require("mongoose").Types;

app.use(cors());
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/ONLINEIDE')
const genAi=new GoogleGenerativeAI(process.env.apiKey);
const model=genAi.getGenerativeModel({model:'gemini-2.0-flash'});

const secretcode=process.env.secretCode;
app.get('/',(req,res)=>{
    res.send("<h1>Hello World</h1>");
})

app.post('/api/login',async (req,res)=>{
    let data=req.body;
    console.log(data)
    try{
        const user=await User.findOne({email:data.email});
        console.log(user);
        if(user){
            let PassComp=await bcrypt.compare(data.pwd,user.password);
            if(PassComp){
                const token=jwt.sign({
                    name:user.name,
                    email:user.email
                },secretcode)

                console.log(token);
                res.json({status:'ok',token});
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

app.post("/api/pushCode",async (req,res)=>{
    const token=req.headers['authorization'];

    try{
        const data=jwt.verify(token,secretcode);
            console.log(req.body);

        const newCode = {
            _id: new ObjectId(),
            code: req.body.Code,
            date: req.body.Date,
            name: req.body.name,
            extension: req.body.extension
            };

        await User.updateOne(
            { email: data.email },
            { $push: { codes: newCode } }
            );

        res.send({
            status: 'ok',
            code: newCode
            });
    }catch{
        res.send({status:'error',error:'Auth Error'})
    }
})
app.get("/api/getUserData",async(req,res)=>{
    const token=req.headers['authorization'];

    try{
        const verify=jwt.verify(token,secretcode);
        const codesData=await User.findOne({email:verify.email});
        res.send({status:'ok',codes:codesData.codes,userName:codesData.name})

    }catch{
        res.send({status:'error'})
    }
})

app.post("/api/updateCode", async (req, res) => {
  const token = req.headers['authorization'];
  try {
    const verify = jwt.verify(token, secretcode);


    const result = await User.updateOne(
      { email: verify.email, "codes._id": new ObjectId(req.body._id) },
      {
        $set: {
          "codes.$.code": req.body.code,
          "codes.$.name": req.body.name,
          "codes.$.date": new Date(), 
        }
      }
    );

    res.send({ status: "ok" });

  } catch (err) {
    console.error("Update error:", err);
    res.send({ status: 'error' });
  }
});

app.post("/api/updateTitle", async (req, res) => {
  const token = req.headers['authorization'];
  try {
    const verify = jwt.verify(token, secretcode);
    
    console.log(req.body);
    const result = await User.updateOne(
      { email: verify.email, "codes._id": new ObjectId(req.body._id) },
      {
        $set: {
          "codes.$.name": req.body.title,
          "codes.$.date": new Date(), 
        }
      }
    );
        console.log(result);

    res.send({ status: "ok" });

  } catch (err) {
    res.send({ status: 'error' ,error:"Network Issues"});
  }
});

app.post("/api/deleteData",async (req,res)=>{
    let token=req.headers['authorization'];

    try{
        const data=jwt.verify(token,secretcode);
        const id = req.body._id;

        const result = await User.updateOne(
        { email: data.email },
        {
            $pull: {
            codes: {
                _id: mongoose.Types.ObjectId.isValid(id) ? new ObjectId(id) : id
            }
            }
        }
        );

        res.send({status:'ok'})
    }catch{
        res.send({status:'error',error:"Session Time Expired"})
    }
})

app.post('/api/AiData',async(req,res)=>{
    try{
        const result=await model.generateContent("For This Prompt : "+req.body.Prompt+"\t In "+req.body.Language+"\t With This Code"+req.body.Code+"Just Give Me The Code Only");
        const aiResponse =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text || "No output";
        res.send({ status: "ok", result: aiResponse });
    }
    catch{
       res.send({status:'error',error:"Network Issue"}) ;
    }
})

app.listen(8000,()=>{
    console.log(`Port is Running At http://localhost:8000`)
})