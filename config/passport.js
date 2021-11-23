const db = require("../models");
const UserProfile = db.userProfiles;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {                //match user
            UserProfile.findOne({ email: email })
                .then((user) => {
                    console.log("1");
                    if (!user) {
                        console.log("2");
                        //console.log("done寫了什麼：", done(null, false, { message: 'that email is not registered' }));
                        return done(null, false, { message: 'that email is not registered' });
                    }
                    //match pass
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        console.log("3");
                        if (err) throw err;
                        console.log("4");
                        if (isMatch) {
                            console.log("5");
                            return done(null, user);
                        } else {
                            console.log("6");
                            return done(null, false, { message: 'pass incorrect' });
                        }
                    })
                })
                .catch((err) => { console.log(err) })
        })

    )
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserProfile.findById(id, function (err, user) {
            done(err, user);
        });
    });
};