const passport = require('passport');

module.exports = app => {
    const userProfiles = require("../controllers/controller.js");

    var router = require("express").Router();

    //login handle
    router.get('/login', (req, res) => {
        res.render('login');
    })
    router.get('/register', (req, res) => {
        res.render('register')
    })
    //Register handle
    router.post('/register', userProfiles.create)
    router.post('/login', (req, res, next) => {
        //console.log(req.body);
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next)
    })

    //logout
    router.get('/logout', (req, res) => {
        req.logout();
        req.flash('success_msg', 'Now logged out');
        res.redirect('/users/login');
    })

    app.use('/users', router);
};