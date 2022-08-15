const mongoose = require('mongoose');

// schema for flow and details of triggers contact list time delay etc 
const flowSchema =new mongoose.Schema({
    messages:[String],
    contactList:[Number],
    triggers:Object,
    timeDelay:Number
});


module.exports = mongoose.model("Flow", flowSchema);