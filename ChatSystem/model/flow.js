const mongoose = require('mongoose');

// schema for flow and details of triggers contact list time delay etc
const flowSchema = new mongoose.Schema({
  title: String,
  tMessageList: Object,
  contactList: [String],
  cid: String,
  data: Object,
  startNode: String,
  defaultData: Object
});


module.exports = mongoose.model("Flow", flowSchema);
