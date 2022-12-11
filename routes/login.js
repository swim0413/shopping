const express = require('express');
const router = express.Router();
const fs = require('fs');

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
    if(!req.session.user) res.render('login', { title: 'login' });
    else res.redirect('/main');
});

router.post('/', (req, res) => {
    let id = req.body.login_id;
    let pw = req.body.login_pw
    let dbIndex = db['data'].findIndex(obj => obj.id == id);
    if(id.trim()=="" || pw.trim()=="") return res.redirect('/');
    
    console.log(id, pw)
    let ids = [];
    let pws = [];
    for(const element of db['data']){
        ids.push(element['id']);
        pws.push(element['pw']);
    }
    if(!ids.includes(id)){
        res.send('없는 아이디 입니다');
        res.redirect('/');
    }else if(!pws.includes(pw)){
        res.send('비밀번호가 틀렸습니다');
        res.redirect('/');
    }else{
        if (req.session.user) {
            // 세션에 유저가 존재한다면
            console.log("이미 로그인 돼있습니다~");
            res.redirect('/main');
        } else {
            req.session.user = {
                id: id,
                pw: pw,
                nickName: db['data'][dbIndex]['nickName'],
                authorized: true,
                isGuest: false,
            };
            console.log(req.session.user);
            res.redirect('/main');
        }
    }
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

router.post('/register', (req, res)=>{
    let id = req.body.register_id;
    let pw = req.body.register_pw;
    let nickName = req.body.nickName
    if(id.trim()=="" || pw.trim()=="" || nickName.trim()=="") return res.redirect('/');
    let ids = [];
    for(const element of db['data']){
        ids.push(element['id']);
    }
    if(ids.includes(id)){
        res.send('중복된 아이디');
        res.redirect('/');
    }else{
        db['data'].push({id,pw,nickName});
        fs.writeFile('./data/users/db.json', JSON.stringify(db, null, 2), 'utf-8', function(err){
            if(err){
                console.log(err);
            }
        });
        console.log(db);
        res.redirect('/');
    }
});

module.exports = router;