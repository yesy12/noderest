const express = require("express");
const router = express.Router();

const User = require("../models/user");

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

            return res.send({ user });
        }
    }
    catch( error){
        console.log(error);
        return res.status(400).send({
            error : "Registration failed"
        });
    }
});

module.exports = router;