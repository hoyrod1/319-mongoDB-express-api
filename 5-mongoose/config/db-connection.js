require("dotenv").config();
// Requiring mongoose to connect to the server
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);
// mongoose.connect(process.env.MONGO_URI,  {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
  .on("error", (error) => console.log(error));

module.exports = mongoose;
