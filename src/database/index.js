const mongoose = require("mongoose");

const username = "noderest";
const password = "Qbg4IKFcKCFQmSpW";
const db = "noderest";

const url = `mongodb+srv://${username}:${password}@cluster0-nth3w.mongodb.net/${db}?retryWrites=true&w=majority`;

mongoose.connect(url,{
    useMongoClient : true
});
mongoose.Promise = global.Promise;

module.exports = mongoose;