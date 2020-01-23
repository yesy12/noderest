const mongoose = require("../../database");
const bcrypt = require("bcryptjs");

const ProjectSchema = new mongoose.Schema({
    name:{
        type : String,
        require : true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: {
        type: Date,
        default: Date.now()
    }
});


const Project = mongoose.model("Project",ProjectSchema);

module.exports = Project;