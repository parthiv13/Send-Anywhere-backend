const mongoose = require('mongoose'),
passport = require('passport'),
LocalStrategy = require('passport-local');

const Users = require('../models/user'),
logger = require('../config/winston');

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        Users.findById(id, (err, user) => {
            done(err, user);
        })
    });

    passport.use('signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        Users.findOne({ email: email })
        .then(user => {
            if(user) {
                return done(null, false, { errors: { 'email': 'is takenm' }});
            } else {
                let newUser = new Users();
                newUser.email = email;
                newUser.password = password;
                newUser.createUser(newUser, (err) => {
                    if(err) {
                        logger.info({ message: err.message });
                        return done(null, false, { errors: err });
                    }
                    return done(null, newUser);
                })
            }
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        Users.findOne({ email: email })
        .then(user => {
            if(!user || !user.validatePassword(password)) {
                return done(null, false, { errors: { 'email or password': 'is taken' }});
            }
            return done(null, user);
        }).catch(err => {
            done(null, false, { errors: { 'err': 'meh' }})
        });
    }));
}