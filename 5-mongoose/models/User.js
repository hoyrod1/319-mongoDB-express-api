const { Schema, model } = require("../config/db-connection");

// This represents the blue print of the data format constraints
// in order to stored in the database after being retrieved from the view
const userSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
});

// You can add pre hooks to your schema right here

module.exports = model("User", userSchema);
