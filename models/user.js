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

// CREATE MODEL WITH NAME 'USER' AND THE USERSCHEMA
const modelClass = model('user', userSchema);

module.exports = modelClass;