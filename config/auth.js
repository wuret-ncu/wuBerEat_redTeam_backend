const passport = require('passport');

module.exports = {
    ensureAuthenticated : function(req,res,next) {
        console.log(req.session.passport.user);
        console.log(passport.user);
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg' , 'please login to view this resource');
        res.redirect('/users/login');
    }
}
