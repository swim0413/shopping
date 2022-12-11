const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.session.user) res.redirect('/');
    else res.render('main', { userName: req.session.user['nickName'] });
});

router.post('/logout', function(req, res){
    if(req.session.user){
        console.log('로그아웃');
        
        req.session.destroy(function(err){
            if(err) throw err;
            console.log('세션삭제후 로그아웃');
            res.redirect('/');
        });
    }
    else{
        console.log('로그인 상태 아님');
        res.redirect('/');
    }
})

module.exports = router;
