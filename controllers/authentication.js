// BRING IN JWT PACKAGE
const jwt = require('jwt-simple');

// BRING IN CRYPTO PACKAGE
const crypto = require('crypto');

// BRING IN BCRYPT 
const bcrypt = require('bcrypt-nodejs');

// BRING IN MODELS
const User = require('../models/user');
const ResetPasswordRequest = require('../models/reset-password-request');
const { token } = require('morgan');

// HELPER FUNCTION WHICH TAKES AN USER OBJECT AND CREATES A TOKEN
// WHICH CONTAINS USERID TIMESTAMP AND THE JWTSECRET
const generateToken = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
};

// FUNCTION TO SIGNUP USER
const signup = (req, res, next) => {

    // CHECK IF EMAIL AND PASSWORD ARE IN THE REQUEST
    const { email, password } = req.body;
    if (!email || !password) return res.status(422).send({ error: 'No email or no password provided' })

    // SEARCH FOR USER WITCH GIVEN EMAIL
    User.findOne({ email: email }, (error, existingUser) => {

        // IF THE USER ALREADY EXIST RETURN AN ERROR
        if (error) return next(error);
        if (existingUser) return res.status(422).send({ error: 'Email is in use'});

        // CREATE A NEW USER WITH THE GIVEN INPUT
        const user = new User({
            email: email, 
            password: password
        });

        // SAVE THE USER TO THE DATABASE AND RETURN A TOKEN TO THE USER
        user.save((error) => {
            if (error) return next(error);
            res.json({ token: generateToken(user) });
        });

    });

};

// FUNCTION TO SIGNIN USER
const signin = (req, res, next) => {

    // SEND BACK A TOKEN TO THE USER
    res.send({ token: generateToken(req.user)});

};

// FUNCTION TO REQUEST PASSWORD RESET
const resetPasswordRequest = (req, res, next) => {

    // CHECK IF EMAIL IS PROVIDED
    const { email } = req.body;
    if ( !email ) return res.status(422).send({ error: 'No email provided' })

    //  SEARCH FOR USER WITH GIVEN EMAIL
    User.findOne({ email: email }, (error, existingUser) => {

        // IF NO USER WITH THIS EMAIL EXIST RETURN ERROR
        if (!existingUser) return res.status(422).send({ error: 'User does not exist'});

        // CHECK IF ALREADY A REQUEST FOR A PASSWORD REQUEST EXIST
        // AND IF IT DOES DELETE IT
        ResetPasswordRequest.findOne({ email: email }, (error, existingResetPasswordRequest) => {
            if (error) return next(error);
            if (existingResetPasswordRequest) existingResetPasswordRequest.deleteOne(); 
        });

        // GENERATE TOKEN 
        const token = crypto.randomBytes(32).toString('hex');

        // GENERATE A SALT
        bcrypt.genSalt(10, function(error, salt) {
            if (error) return next(error);

            // TAKE THE SALT AND THE USERS EMAIL TO CREATE A HASHED TOKEN
            // THEN ADD THE TOKEN TO THE RESET PASSWORD REQUEST
            bcrypt.hash(token, salt, null, function(error, hash) {
                if (error) return next(error);
           
                // CREATE A NEW RESET PASSWORD REQUEST WITH THE GIVEN INPUT
                const resetPasswordRequest = new ResetPasswordRequest({
                    email: email,
                    token: hash
                });
        
                // SAVE THE RESET PASSWORD REQUEST TO THE DATABASE 
                resetPasswordRequest.save((error) => {
                    if (error) return next(error);
                    res.json({ email: email, token: hash });
                });

            });

        });



    });

};

// FUNCTION TO RESET PASSWORD
const resetPassword = (req, res, next) => {
    
    // CHECK IF EMAIL AND PASSWORD IS PROVIDED
    const { email, password, token} = req.body;
    if (!email || !password || !token) return res.status(422).send({ error: 'No email, password or token provided'});

    // CHECK IF A REQUEST FOR A PASSWORD RESET EXIST
    ResetPasswordRequest.findOne({ email: email }, (error, existingResetPasswordRequest) => {
        if (error) return next(error);
        if (!existingResetPasswordRequest) return res.status(422).send({ error: 'No existing request exists'});

        // COMPARE TOKEN WITH HASHED TOKEN
        bcrypt.compare(token, existingResetPasswordRequest.token, (error, isMatch) => {
            if (error) return next(error);

            // UPDATE THE USER WITH THE GIVEN NEW PASSWORD
            User.updateOne({ email: email }, { password: password }, (error, user) => {
                res.json(user);
            });

        });

    });
     
};

module.exports = {
    signup,
    signin,
    resetPasswordRequest,
    resetPassword,
};
