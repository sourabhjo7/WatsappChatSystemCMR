const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  format: {
    type: String,
    default: null,
  },
  sample: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: null,
  },
  requestByName: {
    type: String,
    default: null,
  },
  requestByUID: {
    type: String,
    default: null,
  },
  creationDate: {
    type: String,
    default: null,
  }
});

module.exports = mongoose.model("Template", templateSchema);
