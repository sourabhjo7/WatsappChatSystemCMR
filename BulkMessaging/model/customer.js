const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userName: {
    type: String,
    default: null,
  },
  userPhoneNo: {
    type: String,
    default: null,
  },
  currFlow:{
    type: Object
  }
});

module.exports = mongoose.model("Customer", customerSchema);
