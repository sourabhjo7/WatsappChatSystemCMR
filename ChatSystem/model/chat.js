const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  customerName: {
    type: String,
    default: null,
  },
  userPhoneNo: {
    type: String,
    default: null,
  },
  messageList: {
    type: Array,
    default: []
  },
  agentName: {
    type: String,
    default: null
  },
  managerID: {
    type: String
  },
  lastInteraction: {
    type: String,
    default: Date.now(),
  }
});

module.exports = mongoose.model("Chat", chatSchema);
