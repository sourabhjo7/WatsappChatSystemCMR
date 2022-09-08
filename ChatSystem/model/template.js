const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  format: {
    type: String,
    default: null,
  },
  sample: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: null,
  },
  requestByName: {
    type: String,
    default: null,
  },
  requestByUID: {
    type: String,
    default: null,
  },
  creationDate: {
    type: String,
    default: null,
  }
});

templateSchema.statics.createNewTemplate = function (name, format, sample, requestByName, requestByUID){
  const currentDate = new Date().getTime();

  return this.create({
    name,
    format,
    sample,
    requestByName,
    requestByUID,
    status: "Pending",
    creationDate: currentDate
  }).then((data) => {
    return data;
  });
}

templateSchema.statics.getAllTemplates = function (){
  return this.find();
}

templateSchema.statics.getTemplateById = function (tempID){
  return this.findOne({_id: tempID});
}

templateSchema.statics.getTemplateByStatus = function (status){
  return this.find({status});
}

templateSchema.statics.getTemplateByManagerId = function (managerID){
  return this.find({requestByUID: managerID});
}

module.exports = mongoose.model("Template", templateSchema);
