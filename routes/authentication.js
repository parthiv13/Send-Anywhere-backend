const express = require('express'),
router = express.Router();

const Users = require('../models/user'),
logger = require('../config/winston');

router.post('/login', (req, res, next) => {
    const { body: { user } } = req;
    passport.authenticate('login', (err, user, info) => {
        if(err) return next(err);
        if(user) res.send(user);
        if(!user) res.send(info);
    })(req, res, next)
});

router.post('/signup', (req, res, next) => {
    const { body: { user }} = req;
    passport.authenticate('signup', (err, user, info) => {
        if(err) return next(err);
        if(user) res.send(user);
        if(!user) res.send(info);
    })(req, res, next)
})

module.exports = router;