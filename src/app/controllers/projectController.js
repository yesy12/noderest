const express = require("express");

const authMiddleware = require("../middlewares/auth");
const Project = require("../models/projects");
const Task = require("../models/task");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req,res)=>{
    res.send({
        user : req.useId
    })
})

router.post("/", async (req,res)=>{
    res.send({
        user : req.useId
    })
})

router.get("/:projectId",async (req,res)=>{
    res.send({
        user : req.useId
    })
})


router.put("/:projectId",async (req,res)=>{
    res.send({
        user : req.useId
    })
})

router.delete("/:projectId",async (req,res)=>{
    res.send({
        user : req.useId
    })
})




module.exports = router;