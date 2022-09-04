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

chatSchema.statics.createNewChat = function (customerName, userPhoneNo, messageList, agentName, managerID, lastInteraction){
  return this.create({
    customerName,
    userPhoneNo,
    messageList,
    agentName,
    managerID,
    lastInteraction
  }).then((data) => {
    return data;
  });
}

chatSchema.statics.findChats = function(managerID) {
  if(managerID){
    return this.find({managerID})
  }else{
    return this.find();
  }
}

// const newChat = await Chat.createNewChat(chat.room, chat.phoneNo, chat.messageList, agentName, managerID, lastInteraction);

module.exports = mongoose.model("Chat", chatSchema);
