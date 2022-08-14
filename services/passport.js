// BRIN IN USER MODEL
const User = require('../models/user');

// BRING IN PASSPORT PACKACKE AND ITS PACKAGES FOR THE STRATEGIES
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const ExtractJwt = require('passport-jwt').ExtractJwt;

// DEFINE OPTIONS FOR THE LOCAL OPTIONS
// THIS OPTION IS USED TO TELL PASSPORT HOW THE FIELD WITH THE USER ID IS CALLED
const localOptions = { usernameField: 'email' };

// FUNCTION FOR LOGGIN IN WITH EMAIL AND PASSWORD
// THE FIELDS (EMAIL, PASSWORD) REFERENCE THE FILEDS OF THE REQUEST
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {

    // CHECK IF WE CAN FIND A USER WITH THE GIVEN EMAIL
    // IF WE DONT RETURN AN ERROR
    User.findOne({ email: email }, (error, user) => {
        if (error) return done(error);
        if (!user) return done(null, false);

        // IF AN USER WITH THIS EMAIL WAS FOUND USE THE 'COMPAREPASSWORD' FUNCTION 
        // FROM THE THE USER MODEL TO CHECK THAT THE PASSWORD IS CORRECT
        user.comparePassword(password, (error, isMatch) => {
            if (error) return done(error);
            if (!isMatch) return done(null, false);
            return done(null, user);
        });

    });

});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.JWT_SECRET
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub, (error, user) => {
        if (error) return done(error, false);
        if (!user) return done(null, false);
        done(null, user);
    });
});

passport.use(jwtLogin);
passport.use(localLogin);
