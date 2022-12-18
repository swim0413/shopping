const express = require('express');
const router = express.Router();
const fs = require('fs');
const connect = require('../db/connect.js');
const {createHashedPassword, verifyPassword} = require('../db/encrypt.js');

async function makeDB(id, pw, nickName){
    let connection;
    try{
        connection = await connect();
        const db  = await connection.db('shop');
        const users = db.collection('users');
        let {hashedPassword, salt} = await createHashedPassword(pw)
        let form = {id,hashedPassword,salt,nickName};
        await users.insertOne(form);
    }catch(e){
        console.log(e.message);
    }finally{
        connection.close();
    }
}

async function verifyPW(input_id, input_pw){
    let connection;
    let res = false;
    try{
        connection = await connect();
        const db  = await connection.db('shop');
        const users = db.collection('users');
        let {id, hashedPassword, salt, nickName} = await users.findOne({id:input_id});
        res = await verifyPassword(input_pw, salt, hashedPassword);
        console.log(id);
    }catch(e){
        console.log(e.message);
    }finally{
        connection.close();
    }
    return res;
}

async function getDBInfo(id){
    let connection;
    let res;
    try{
        connection = await connect();
        const db  = await connection.db('shop');
        const users = db.collection('users');
        res = await users.findOne({id:id});
    }catch(e){
        console.log(e.message);
    }finally{
        connection.close();
    }
    return res;
}

async function isExist(id){
    let res = false;
    if(await getDBInfo(id)){
        res = true;
    }
    return res;
}

let db = null;
if(!fs.existsSync('./data/users/db.json')){
    let initial = JSON.parse('{"data": []}');
    fs.writeFile('./data/users/db.json', JSON.stringify(initial, null, 2), 'utf-8', function(err){
        if(err){
            console.log(err);
        }
    })
}
fs.readFile('./data/users/db.json', 'utf-8', (err, jsonFile)=>{
    db = JSON.parse(jsonFile);
});
/* GET login page. */
router.get('/', function(req, res, next) {
    //테스트 때 로그인 유지
    // req.session.user = {/////////////!!!!!!!!!!!
    //     id: null,
    //     pw: null,
    //     nickName: 'Guest',
    //     authorized: true,
    //     isGuest: true,
    // };
    if(!req.session.user) res.render('login', { title: 'login' });
    else res.redirect('/main');
});

router.post('/', async (req, res) => {
    let id = req.body.login_id;
    let pw = req.body.login_pw;
    //let dbIndex = db['data'].findIndex(obj => obj.id == id);
    if(id.trim()=="" || pw.trim()=="") return res.redirect('/');
    
    if(!await verifyPW(id, pw)){
        res.send('없는 아이디거나 비밀번호가 틀렸습니다!');
    }else{
        if(req.session.user){
            console.log('이미 로그인 돼있습니다');
            res.redirect('/main');
        }else{
            req.session.user = {
                id: id,
                pw: pw,
                nickName: (await getDBInfo(id))['nickName'],
                authorized: true,
                isGuest: false,
            };
            console.log(req.session.user);
            res.redirect('/main');
        }
    }

    // console.log(id, pw)
    // let ids = [];
    // let pws = [];
    // for(const element of db['data']){
    //     ids.push(element['id']);
    //     pws.push(element['pw']);
    // }
    // if(!ids.includes(id)){
    //     res.send('없는 아이디 입니다');
    //     res.redirect('/');
    // }else if(!pws.includes(pw)){
    //     res.send('비밀번호가 틀렸습니다');
    //     res.redirect('/');
    // }else{
    //     if (req.session.user) {
    //         // 세션에 유저가 존재한다면
    //         console.log("이미 로그인 돼있습니다~");
    //         res.redirect('/main');
    //     } else {
    //         req.session.user = {
    //             id: id,
    //             pw: pw,
    //             nickName: db['data'][dbIndex]['nickName'],
    //             authorized: true,
    //             isGuest: false,
    //         };
    //         console.log(req.session.user);
    //         res.redirect('/main');
    //     }
    // }

});

router.post('/guestLogin', (req, res)=>{
    if (req.session.user) {
        // 세션에 유저가 존재한다면
        console.log("이미 로그인 돼있습니다~");
        res.redirect('/main');
    } else {
        req.session.user = {
            id: null,
            pw: null,
            nickName: 'Guest',
            authorized: true,
            isGuest: true,
        };
        console.log(req.session.user);
        res.redirect('/main');
    }
});

router.post('/register', async (req, res)=>{
    let id = req.body.register_id;
    let pw = req.body.register_pw;
    let nickName = req.body.nickName
    if(id.trim()=="" || pw.trim()=="" || nickName.trim()=="") return res.redirect('/');
    
    if(await isExist(id)){
        res.send('중복 아이디');
    }else{
        makeDB(id,pw,nickName);
        res.redirect('/');
    }
    // let ids = [];
    // for(const element of db['data']){
    //     ids.push(element['id']);
    // }
    // if(ids.includes(id)){
    //     res.send('중복된 아이디');
    //     res.redirect('/');
    // }else{
    //     db['data'].push({id,pw,nickName});
    //     fs.writeFile('./data/users/db.json', JSON.stringify(db, null, 2), 'utf-8', function(err){
    //         if(err){
    //             console.log(err);
    //         }
    //     });
    //     console.log(db);
    //     res.redirect('/');
    // }
});

module.exports = router;