const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user");
const authConfig = require("../../config/auth");
const mailer = require("../../modules/mailer")


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

            return res.send({
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
        }///////////////////////////////////////
        else{
            const token = crypto.randomBytes(20).toString("hex");

            const now = new Date();
            now.setHours(now.getHours() + 1);

        /*
            (node:3532) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` 
            without the `useFindAndModify` option set to false are deprecated. 
            See: https://mongoosejs.com/docs/deprecations.html#-findandmodify-
        */
       
            await User.findByIdAndUpdate(user.id,{
                "$set":{
                    "passwordResetToken" : token,
                    "passwordResetExpires" : now
                }
            },
            { 
                new: true, 
                useFindAndModify: false 
            })////////////////////////

            // return res.send({
            //                 ok: email
            // })

            await mailer.sendMail({
                to : email,
                from : "alisonvieira.av29@gmail.com",
                subject: "Forgot Password", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>Por enquanto acesse esse token, ${token}, corrigiremos isso no futuro </b>` // html body
                // template : "./auth/forgot_password",
                // context: { token }
            }, (err) => {
                if(err){
                    return res.status(400)
                        .send({
                            "error" : "Cannot send forgot password email"
                    })
                }//////////////////
                else{
                    return res.send({
                        ok: true
                    })
                }
            })
        }///////////////////////////////////////

    }///////////////////////////////////////
    catch(err){
        console.log(err)
        return res.status(400)
        .send({
            error : "Erro on forgot password, try again" 
        })
    }
})

router.post("/reset_password", async (req,res) =>{
    const { email, token, password } = req.body;

    try {

        const user = await User.findOne({
            email
        }).select("+passwordResetToken passwordResetExpires");

        if(!user){
            return res.send({
                error : "User not exists"
            })
        }
        else{

            if(token !== user.passwordResetToken){
                return res.status(400)
                    .send({
                        error : "token invalid"
                    })
            }
            else {
                const now = new Date();

                if(now > user.passwordResetExpires){
                    return res.status(400)
                        .send({
                            error : "Token expired, generate a new one"
                        });
                }else{

                    user.password = password; 
                    
                    await user.save();

                    return res.send({
                        ok : true
                    })
                }
            }
        }
    }

    catch ( err) {
        return res.status(400)
            .send({
                error : "Cannot reset password, try again"
            });
    }


})

module.exports = router;