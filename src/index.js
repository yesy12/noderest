const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const authController = require("./controllers/authController");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : false
}));

app.use("/auth",authController);


app.listen(port,()=>{
    console.log(`Running on port ${port}`)
})