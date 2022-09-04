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

flowSchema.statics.createFlow = function (title, tMessageList, contactList, cid, startNode, nodes, edges){
  return this.create({
    title,
    tMessageList,
    contactList,
    cid,
    data: {
      started: 0,
      ended: 0,
    },
    startNode,
    defaultData: {
      nodes: nodes,
      edges: edges
    }
  }).then((data) => {
    return data;
  });
}

flowSchema.statics.getFlowById = function (flowID) {
  return this.findOne({_id: flowID});
}

flowSchema.statics.getFlowsByManagerId = function (managerId) {
  return this.find({cid: managerId});
}

module.exports = mongoose.model("Flow", flowSchema);
