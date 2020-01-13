const express = require("express");
const router =  express.Router();

const authController = require("./app/controllers/authController");
const projectsController = require("./app/controllers/projectController");


router.use("/auth",authController);
router.use("/projects",projectsController);


module.exports = router;