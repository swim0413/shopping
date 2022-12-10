const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.session.user) res.redirect('/');
    else res.render('main', { title: req.session.user['id'] });
});

module.exports = router;
