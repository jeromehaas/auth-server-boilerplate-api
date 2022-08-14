// BRING IN JWT PACKAGE
const jwt = require('jwt-simple');

// BRING IN USER MODEL
const User = require('../models/user');

// HELPER FUNCTION WHICH TAKES AN USER OBJECT AND CREATES A TOKEN
// WHICH CONTAINS USERID TIMESTAMP AND THE JWTSECRET
const tokenForUser = (user) => {
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

        // IF THE USER DOES NOT EXIST CREATE A NEW USER WITH THE GIVEN INPUT
        const user = new User({
            email: email, 
            password: password
        });

        // SAVE THE USER TO THE DATABASE AND RETURN A TOKEN TO THE USER
        user.save((error) => {
            if (error) return next(error);
            res.json({ token: tokenForUser(user) });
        });

    });

};

// FUNCTION TO SIGNIN USER
const signin = (req, res, next) => {

    // SEND BACK A TOKEN TO THE USER
    res.send({ token: tokenForUser(req.user)});

};

module.exports = {
    signup,
    signin
};
