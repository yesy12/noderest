const express = require("express");
const router =  express.Router();

const authController = require("./authController");
const projectsController = require("./projectController");

router.use("/auth",authController);
router.use("/projects",projectsController);


module.exports = router;