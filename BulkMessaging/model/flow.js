const mongoose = require('mongoose');

// schema for flow and details of triggers contact list time delay etc
const flowSchema = new mongoose.Schema({
  title: String,
  tMessages: [String],
  contactList: [Number],
  triggers: Object,
  timeDelay: Number,
  cid:  String
});


module.exports = mongoose.model("Flow", flowSchema);
