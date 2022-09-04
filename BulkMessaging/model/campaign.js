const mongoose = require('mongoose');

// schema for flow and details of triggers contact list time delay etc
const campaignSchema = new mongoose.Schema({
  title: String,
  tFlowList: Object,
  contactList: [String],
  cid: String,
  startFlow: String,
});

campaignSchema.statics.createCampaign = function (title, tFlowList, contactList, cid, startFlow){
  return this.create({
    title,
    tFlowList,
    contactList,
    cid,
    startFlow
  }).then((data) => {
    return data;
  });
}

campaignSchema.statics.getCampaignById = function (campaignID) {
  return this.findOne({_id: campaignID});
}

module.exports = mongoose.model("Campaign", campaignSchema);
