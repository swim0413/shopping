const MongoClient = require('mongodb').MongoClient;
const setting = require('./config');
let conUrl = setting.dbUrl;

const connect = (mongoUrl=conUrl)=>MongoClient.connect(mongoUrl,{useNewUrlParser:true, useUnifiedTopology:true});
module.exports = connect;