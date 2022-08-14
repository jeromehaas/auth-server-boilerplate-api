// BRING IN ALL FUNCTIONS RELATED TO AUTHENTICATION (SINGIN, SIGNUP, AUTH)
const Authentication = require('./controllers/authentication');

// BRING IN PASSPORT PACKAGE AND ITS SERVICE FUNCTIONS
const passportService = require('./services/passport');
const passport = require('passport');

// CREATE MIDDLEWARE FUNCTIONS FOR EACH STRATEGY (JWT, LOCAL)
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });


const router = (app) => {

    // FOR EACH ROUTE WHICH REQUIRE AUTH YOU CAN USE THE 'REQUIREAUTH'
    // FUNCTION WHICH CHECKS IF THE USER HAS A VALID TOKEN
    app.get('/', requireAuth,  (req, res) => {
        res.send({isLoggedin: 'true'}); 
    });

    // WHEN THE USER SIGNS UP WE CHECK IF THE EMAIL IS ALREADY IN USE
    // IF THIS IS NOT THE CASE WE CREATE THE USER AND SEND BACK A TOKEN
    app.post('/signup', Authentication.signup);

    // WHEN AN EXISTING USER SIGNS UP WE MUST CHECK IF THE GIVEN EMAIL
    // EXISTS IN OUR DATABASE AND IF ITS RELATED PASSWORD MATCHES THE INPUT
    app.post('/signin', requireSignin, Authentication.signin);

    // PROVIDE ROUTE FOR REQESTING A PASSWORD RESET
    app.post('/reset-password-request', Authentication.resetPasswordRequest);

    // PROVIDE ROUTE FOR RESETING PASSWORD
    app.post('/reset-password', Authentication.resetPassword);
};

module.exports = router;

