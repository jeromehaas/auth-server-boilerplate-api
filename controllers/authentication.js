// BRING IN JWT PACKAGE
const jwt = require('jwt-simple');

// BRING IN CRYPTO PACKAGE
const crypto = require('crypto');

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
    if ( !email || !password) return res.status(422).send({ error: 'No email or no password provided' })

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
const requestPasswordReset = (req, res, next) => {

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

        // CREATE A NEW RESET PASSWORD REQUEST WITH THE GIVEN INPUT
        const resetPasswordRequest = new ResetPasswordRequest({
            email: email,
        });

        // SAVE THE RESET PASSWORD REQUEST TO THE DATABASE 
        resetPasswordRequest.save((error) => {
            if (error) return next(error);
            res.json({ resetPasswordRequestCreated: true });
        });



    });


}

module.exports = {
    signup,
    signin,
    requestPasswordReset,
};
