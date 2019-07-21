const mongoose = require('mongoose'),
bcrypt = require('bcrypt'),
{ salts } = require('../config');

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    device: {
        type: Array
    }
});

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.createUser = function(newUser, cb) {
    bcrypt.hash(newUser.password, salts)
    .then(hash => {
        newUser.password = hash;
        newUser.save(cb);
    })
}

var User = module.exports = mongoose.model('User', UserSchema);