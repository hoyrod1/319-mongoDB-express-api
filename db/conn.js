//============= Importing the .env file =============//
// containing the connection string and the PORT number
require("dotenv").config();
//===================================================//
// require Mongoose to connect to the database
// using Mongoose
const mongoose = require("mongoose");

//===================================================//
// Connect to Database
mongoose.connect(process.env.MONGO_URI);
mongoose.connection
  .on("open", () => console.log(`Connected to Mongoose`))
  .on("close", () => console.log(`Disconnected to Mongoose`))
  .on("error", () => console.log(error));
module.exports = mongoose;
//===================================================//
