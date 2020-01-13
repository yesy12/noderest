const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user");
const authConfig = require("../../config/auth");

const router = express.Router();

router.post("/register", async (req,res) => {
    const { email, name, password } = req.body;
    const object = {
        email,
        name,
        password
    }

    try{
        if(await User.findOne({email})){
            return res.status(400).send({
                error : "User already exists"
            })
        }else{
            const user = await User.create(object);
        
            user.password = undefined;

            return res.send({ 
                user,
                token: generateToken({ id: user.id }) 
            });
        }
    }
    catch( error){
        console.log(error);
        return res.status(400).send({
            error : "Registration failed"
        });
    }
});

function generateToken(params = {}){
    return jwt.sign(params,
    authConfig.secret,{
        expiresIn : 180,
    });
}

router.post("/authenticate", async (req,res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ 
        email 
    }).select("+password");

    if(!user){
        return res.status(400)
        .send({
            error : "User not found" 
        });
    }
    else {
        const compare_password = await bcrypt.compare(password, user.password);

        if(!compare_password){
            return res.status(400)
            .send({
                error : "Invalid password"
            })
        }
        else{

            user.password = undefined;

            const token = generateToken({ id: user.id })

            res.send({
                user,token
            });
        }
    }

})

router.post("/forgot_password", async (req,res) => {
    const { email } = req.body;

    try{
        const user = await User.findOne({
            email
        })

        if(!user){
            return res.status(400)
            .send({
                error : "User not found" 
            });
        }
        else{

            const token = crypto.randomBytes(20).toString("hex");

            const now = new Date();
            now.setHours(now.getHours() + 1);

            
        }
    }
    catch(err){
        res.status(400)
        .send({
            error : "Erro on forgot password, try again" 
        })
    }
})

module.exports = router;