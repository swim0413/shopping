const express = require('express');
const router = express.Router();
const fs = require('fs');

let db = null;
if(!fs.existsSync('./data/db.json')){
    let initial = JSON.parse('{"data": []}');
    fs.writeFile('./data/db.json', JSON.stringify(initial, null, 2), 'utf-8', function(err){
        if(err){
            console.log(err);
        }
    })
}
fs.readFile('./data/db.json', 'utf-8', (err, jsonFile)=>{
    db = JSON.parse(jsonFile);
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login' });
});

// let users = {
//     "data":[
//         {
//             'id': 'asdf',
//             'pw': 'aa',
//         },
//         {
//             'id': 'fd',
//             'pw': 'ss',
//         },
//     ]
// }

router.post('/', (req, res) => {
    let id = req.body.login_id;
    let pw = req.body.login_pw
    console.log(id, pw)
    let ids = [];
    let pws = [];
    for(const element of db['data']){
        ids.push(element['id']);
        pws.push(element['pw']);
    }
    if(!ids.includes(id)){
        res.redirect('/');
    }else if(!pws.includes(pw)){
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
              name: "null",
              authorized: true,
            };
            console.log(req.session.user);
            res.redirect('/main');
          }
    }
});

router.post('/register', (req, res)=>{
    let id = req.body.register_id;
    let pw = req.body.register_pw;
    let ids = [];
    for(const element of db['data']){
        ids.push(element['id']);
    }
    if(ids.includes(id)){
        res.redirect('/');
    }else{
        db['data'].push({id,pw});
        fs.writeFile('./data/db.json', JSON.stringify(db, null, 2), 'utf-8', function(err){
            if(err){
                console.log(err);
            }
        });
        console.log(db);
        res.redirect('/');
    }
});

module.exports = router;