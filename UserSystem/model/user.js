const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  creatorUID: {
    type: String,
  },
  assignedNumber: {
    type: Number,
  },
  appName: {
    type: String,
  },
  apiKey: {
    type: String,
  },
  escalations: {
    type: [Object]
  },
  token: {
    type: String,
  }
});

module.exports = mongoose.model("User", userSchema);
