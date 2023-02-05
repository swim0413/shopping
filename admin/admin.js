const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const connect = require('../db/connect.js');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let products = await getDB();
    products = JSON.stringify(products);
    if(!req.session.user) res.redirect('/');
    else if(req.session.user['id'] != 'swim' ) res.redirect('/');
    else res.render('../admin/admin.ejs', { userName: req.session.user['nickName'], products: JSON.parse(products)});
});

router.post('/addProduct', async (req, res)=>{
    let product_name = req.body.product_name;
    let product_desc = req.body.product_desc;
    let product_detail = req.body.product_detail;
    let product_price = req.body.product_price;
    let product_img_base64 = req.body.product_img_base64;
    if(product_name.trim()=="" || product_desc.trim()=="" || product_price.trim()=="" || product_img_base64.trim()=="") return res.redirect('/admin');
    else await makeDB(product_name,product_desc,product_detail,product_price,product_img_base64);
    res.redirect('../shop')
});

router.post('/delProduct', async (req, res)=>{
    let delProductId = req.body.delProductId;
    await delDB(delProductId);
    res.redirect('../admin');
})

async function makeDB(p_n, p_d, p_dt, p_p, p_i_b){
    let connection;
    try{
        connection = await connect();
        const db  = await connection.db('shop');
        const products = db.collection('products');
        let form = {title:p_n,base64_img:p_i_b,price:p_p,desc:p_d, detail: p_dt};
        await products.insertOne(form);
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

async function delDB(_id){
    let connection;
    let res;
    try{
        connection = await connect();
        const db  = await connection.db('shop');
        const products = db.collection('products');
        res = await products.deleteOne({_id:new mongodb.ObjectID(_id)});
    }catch(e){
        console.log(e.message);
    }finally{
        connection.close();
    }
    return res;
}

module.exports = router;
