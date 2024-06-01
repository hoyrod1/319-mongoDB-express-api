const { Schema, model } = require("../config/db-connection");

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
    min: 5,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 120,
    message: "Age must be between the age of 18 and 120",
  },
  isCool: Boolean,
  skills: [String],
  pets: [
    {
      name: String,
      type: String,
      color: String,
      age: Number,
      isCute: Boolean,
    },
  ],
});

module.exports = model("User", userSchema);
