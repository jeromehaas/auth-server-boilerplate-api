// BRING IN MONGOOSE PACKAGE AND ITS PACKAGE FOR THE SCHEMA AND THE MODEL
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

// BRING IN THE BCRYPT PACKAGE FOR ENCRYPTING PASSWORDS
const bcrypt = require('bcrypt-nodejs');

const resetPasswordRequestSchema = new Schema({
    email: { type: String, required: true, lowercase: true },
    token: { type: String, required: false },
});

resetPasswordRequestSchema.pre('save', function(next) {

    // BIND THE RESET PASSWORD REQUEST
    const resetPasswordRequest = this;

    // GENERATE A SALT
    bcrypt.genSalt(10, function(error, salt) {
        if (error) return next(error);

        // TAKE THE SALT AND THE USERS EMAIL TO CREATE A HASHED TOKEN
        // THEN ADD THE TOKEN TO THE RESET PASSWORD REQUEST
        bcrypt.hash(resetPasswordRequest.email, salt, null, function(error, hash) {
            if (error) return next(error);
            resetPasswordRequest.token = hash;
            next();
        });

    });

});

const modelClass = model('reset-password-request', resetPasswordRequestSchema);

module.exports = modelClass;
