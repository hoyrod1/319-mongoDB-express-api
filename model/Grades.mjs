const { Schema, model } = require("../db/conn.js");

const gradesSchema = Schema({
  scores: {
    type: [
      {
        type: String,
        score: Number,
      },
    ],
    required: true,
  },
  class_id: {
    type: Number,
    required: true,
  },
  learner_id: {
    type: Number,
    required: true,
  },
});

module.exports = model("Grades", gradesSchema);
