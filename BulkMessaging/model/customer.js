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
  },
  allFLows: {
    type: Array,
    default: []
  },
  currCampaign: {
    type: Object
  }
});

customerSchema.statics.createNewCustomer = function (userName, userPhoneNo){
  return this.create({
    userName,
    userPhoneNo
  }).then((data) => {
    return data;
  });
}

customerSchema.statics.getAllCustomers = function (){
  return this.find();
}

customerSchema.statics.getCustomerByNum = function (num){
  return this.findOne({userPhoneNo: num});
}

module.exports = mongoose.model("Customer", customerSchema);
