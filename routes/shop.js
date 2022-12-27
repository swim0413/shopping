var express = require('express');
var router = express.Router();
const connect = require('../db/connect.js');

async function makeDB(title, base64_img, price, desc){
    let connection;
    try{
        connection = await connect();
        const db  = await connection.db('shop');
        const users = db.collection('products');
        let form = {title, base64_img, price, desc};
        await users.insertOne(form);
    }catch(e){
        console.log(e.message);
    }finally{
        connection.close();
    }
}

async function getDB(){
    let connection;
    let res;
    try{
        connection = await connect();
        const db  = await connection.db('shop');
        const products = db.collection('products');
        res = await products.find({}).toArray();
    }catch(e){
        console.log(e.message);
    }finally{
        connection.close();
    }
    return res;
}
console.log(getDB())

/* GET home page. */
router.get('/', async function(req, res, next) {
    let products = await getDB();
    products = JSON.stringify(products)
    if(!req.session.user) res.redirect('/');
    else res.render('shop', { userName: req.session.user['nickName'], products: JSON.parse(products)});
});

module.exports = router;
