const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : false
}));


app.get("/",(req,res)=>{
    res.send("ok");
})

const port = 3000;
app.listen(port,()=>{
    console.log(`Running on port ${port}`)
})