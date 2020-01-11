const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : false
}));

require("./controllers/authController")(app);


app.listen(port,()=>{
    console.log(`Running on port ${port}`)
})