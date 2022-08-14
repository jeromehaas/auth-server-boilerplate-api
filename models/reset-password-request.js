// BRING IN MONGOOSE PACKAGE AND ITS PACKAGE FOR THE SCHEMA AND THE MODEL
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const resetPasswordRequestSchema = new Schema({
    email: { type: String, required: true, lowercase: true },
    token: { type: String, required: false },
});

const modelClass = model('reset-password-request', resetPasswordRequestSchema);

module.exports = modelClass;
