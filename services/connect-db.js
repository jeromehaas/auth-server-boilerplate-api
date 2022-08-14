// BRING IN MONGOOSE PACKAGE
const mongoose = require("mongoose");

// CONNECT TO MONGODB
const connectDB = async () => {
  try {
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_NAME}.u8mm9l8.mongodb.net/${process.env.MONGODB_COLLECTION}?retryWrites=true&w=majority`);
	  console.log(`🔑 SUCCESS: successfully connected to the database!`);
  } catch (error) {
	  console.log(`🔴 ERROR: ${error.message}`);
  };
};

module.exports = connectDB;