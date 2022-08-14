// BRING IN ENV VARS FOR PROTECTED SECRETS
require('dotenv').config();

// BRING IN MIDDLEWARES
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

// BRING IN ROUTER
const router = require('./router.js');

// BRING IN EXPRESS APP INSTANCE
const express = require('express');
const app = express();

// BRING IN FUNCTION TO CONNECT TO MONGODB
const connectDB = require('./services/connect-db');

// DEFINE A PORT 
const port =  process.env.APP_PORT || 3090

// CORS IS USED TO ALLOW REQUESTS FROM OTHER DOMAINS
app.use(cors());

// MORGAN IS USED FOR LOGIN -> GIVES A LOG ON EACH REQUEST
app.use(morgan('combined'));

// BODAYPARSER PARSES ALL REQUESTS TO JSON
app.use(bodyParser.json({ type: '*/*' }));

// THE ROUTER FUNCTION DIRECTION ALL REQUESTS TO THE ROUTER
// WHERE EACH REQUEST MEETS ITS CONTROLLER
router(app);

// START UP THE SERVER AND CONNECT TO THE DB
app.listen( port, async () => {
    await connectDB();
    console.log(`⭐ SUCCESS: server is up and running on port ${port}!`);
});
