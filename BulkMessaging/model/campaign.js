const mongoose = require('mongoose');

// schema for flow and details of triggers contact list time delay etc
const campaignSchema = new mongoose.Schema({
  title: String,
  tFlowList: Object,
  contactList: [String],
  cid: String,
  startFlow: String,
});


module.exports = mongoose.model("Campaign", campaignSchema);
