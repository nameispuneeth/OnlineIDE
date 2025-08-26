const express = require('express');
const app = express();
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require("mongoose").Types;

app.use(cors());
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/ONLINEIDE')
const genAi = new GoogleGenerativeAI(process.env.apiKey);
const model = genAi.getGenerativeModel({ model: 'gemini-2.0-flash' });

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.gmail,
        pass: process.env.password
    }
});

const secretcode = process.env.secretCode;

app.post('/api/login', async (req, res) => {
    let data = req.body;
    try {
        const user = await User.findOne({ email: data.email });
        if (user) {
            let PassComp = await bcrypt.compare(data.pwd, user.password);
            if (PassComp) {
                const token = jwt.sign({
                    name: user.name,
                    email: user.email
                }, secretcode);

                res.json({ status: 'ok', token });
            }
            else {
                res.json({ status: 'error', error: 'Invalid Credientials' })
            }
        } else {
            res.json({ status: 'error', error: 'Email Doesnt Exist' })
        }
    }
    catch {
        res.json({ status: 'error', error: 'Network Issues' })

    }
})


app.post('/api/register', async (req, res) => {
    let data = req.body;
    try {
        const temp = await User.findOne({ email: data.email });
        if (temp) {
            res.json({ status: 'error', error: 'Email In Use' });
        } else {
            const newPassword = await bcrypt.hash(data.pwd, 10);
            const token = jwt.sign({
                name: data.name,
                email: data.email,
                password: newPassword
            }, secretcode);
            const OTP = Math.floor(100000 + Math.random() * 900000);

            let mailOptions = {
                from: `"Codebite IDE" <${process.env.gmail}>`,
                to: data.email,
                subject: 'Your Email Verification Code for Register',
                html: `
    <div style="font-family: Arial, sans-serif; line-height:1.5;">
      <h3><b>Hello There,</h3>
    <h4>Your verification code is:</h4> <h1>${OTP}</h1>
      <h5>Please use this code within 5 minutes</span>.</h5>
      <br/>
      <p>Best regards,<br/><b>Codebite IDE Team</b></p>
    </div>
  `
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.send({ status: 'error', error: 'NETWORK ISSUES' })
                } else {
                    res.send({ status: 'ok', OTP: OTP, token: token });
                }
            });

        }
    }
    catch {
        res.json({ status: 'error', error: 'Network Issues' });
    }

})

app.post("/api/pushCode", async (req, res) => {
    const token = req.headers['authorization'];

    try {
        const data = jwt.verify(token, secretcode);

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
    } catch {
        res.send({ status: 'error', error: 'Auth Error' })
    }
})
app.get("/api/getUserData", async (req, res) => {
    const token = req.headers['authorization'];

    try {
        const verify = jwt.verify(token, secretcode);
        const codesData = await User.findOne({ email: verify.email });
        res.send({ status: 'ok', codes: codesData.codes, userName: codesData.name })

    } catch {
        res.send({ status: 'error' })
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

        const result = await User.updateOne(
            { email: verify.email, "codes._id": new ObjectId(req.body._id) },
            {
                $set: {
                    "codes.$.name": req.body.title,
                    "codes.$.date": new Date(),
                }
            }
        );

        res.send({ status: "ok" });

    } catch (err) {
        res.send({ status: 'error', error: "Network Issues" });
    }
});

app.post("/api/deleteData", async (req, res) => {
    let token = req.headers['authorization'];

    try {
        const data = jwt.verify(token, secretcode);
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

        res.send({ status: 'ok' })
    } catch {
        res.send({ status: 'error', error: "Session Time Expired" })
    }
})

app.post('/api/AiData', async (req, res) => {
    try {
        const result = await model.generateContent("For This Prompt : " + req.body.Prompt + "\t In " + req.body.Language + "\t With This Code" + req.body.Code + "Just Give Me The Code Only");
        const aiResponse =
            result.response.candidates?.[0]?.content?.parts?.[0]?.text || "No output";

        res.send({ status: "ok", result: aiResponse });
    }
    catch {
        res.send({ status: 'error', error: "Network Issue" });
    }
})

app.post("/api/emailExists", async (req, res) => {
    const data = req.body;
    const result = await User.findOne({ email: data.email });

    if (result) {
        const token = jwt.sign({
            name: result.name,
            email: result.email
        }, secretcode);

        const OTP = Math.floor(100000 + Math.random() * 900000);

        let mailOptions = {
            from: `"Codebite IDE" <${process.env.gmail}>`,
            to: data.email,
            subject: 'Your Email Verification Code for PassWord Change',
            html: `
    <div style="font-family: Arial, sans-serif; line-height:1.5;">
      <h3><b>Hello There,</h3>
    <h4>Your verification code is:</h4> <h1>${OTP}</h1>
      <h5>Please use this code within 5 minutes</span>.</h5>
      <br/>
      <p>Best regards,<br/><b>Codebite IDE Team</b></p>
    </div>
  `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.send({ status: 'error', error: 'NETWORK ISSUES' })
            } else {
                res.send({ status: 'ok', OTP: OTP, token: token });
            }
        });


    }
    else res.send({ status: 'error', error: 'No Email Exists' });
})

app.post("/api/changePWD", async (req, res) => {
    const token = req.headers['authorization'];
    const newPWD = req.body.pwd1;
    try {
        const data = jwt.verify(token, secretcode);
        const newPassword = await bcrypt.hash(newPWD, 10);
        const updationres = await User.updateOne({ email: data.email }, { $set: { password: newPassword } });
        res.send({ status: 'ok' });

    } catch {
        res.send({ status: 'error', error: 'Session Expired' });
    }
})
app.get("/api/registerUser", async (req, res) => {
    const token = req.headers['authorization'];
    try {
        const data = jwt.verify(token, secretcode);
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
        })
        res.send({ status: 'ok' });
    } catch {
        res.send({ status: 'error', error: 'Network Issues' })
    }
})
app.listen(8000, () => {
    console.log(`Port is Running At http://localhost:8000`)
})