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

// HELPER FUNCTION WHICH TAKES A TOKEN AND CHECKS IF IT MATCHERS WITH ITS HASH
resetPasswordRequestSchema.methods.compareToken = function(candidateToken, callback) {

    // COMPARE PLAIN TOKEN WITH HASH
    bcrypt.compare(candidateToken, this.token , function(error, isMatch) {
        if (error) return callback(error);
        callback(null, isMatch);
    });

};

const modelClass = model('reset-password-request', resetPasswordRequestSchema);

module.exports = modelClass;
