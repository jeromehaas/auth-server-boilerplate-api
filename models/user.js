// BRING IN MONGOOSE PACKAGE AND ITS PACKAGE FOR THE SCHEMA AND THE MODEL
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

// BRING IN THE BCRYPT PACKAGE FOR ENCRYPTING PASSWORDS
const bcrypt = require('bcrypt-nodejs');

// DEFINE THE SCHEMA FOR THE USER
const userSchema = new Schema({
    email:  { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, },
});

// EVERYTIME BEFORE WE SAVE AN USER TO THE DATABASE HASH THE PLAIN PASSWORD
userSchema.pre('save', function(next) {

    // BIND THE USER 
    const user = this;

    // GENERATE A SALT 
    bcrypt.genSalt(10, function(error, salt) {
        if (error) return next(error);

        // TAKE THE SALT AND THE USERS PASSWORD TO CREATE A HASHED PASSWORD
        // THEN OVERRIDE THE PLAIN PASSWORD WITH THIS HASH 
        bcrypt.hash(user.password, salt, null, function(error, hash) {
            if (error) return next(error);
            user.password = hash;
            next();
        });

    });

});

// HELPER FUNCTION WHICH TAKES A PLAIN PASSWORD AND CHECKS IF IT MATCHES THE HASED PASSWORD
userSchema.methods.comparePassword  = function(candidatePassword, callback) {

    // COMPARE PLAIN PASSWORD WITH HASH
    bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
        if  (error) return callback(error);
        callback(null, isMatch);
    });

};

// CREATE MODEL WITH NAME 'USER' AND THE USERSCHEMA
const modelClass  = model('user', userSchema);

module.exports = modelClass