const express = require("express");
const router = express.Router();

const axios = require("axios").default;
const { URLSearchParams } = require('url');

const {allOtpedUsers, allAprovedTemplates} = require("../helpers/getUsersOrTemplate");
const {broadcastMessage} = require("../helpers/broadcastMessage");

const Customer = require("../model/customer");
const Template = require("../model/template");
const Flow =require("../model/flow");

const baseUserSystemURL = "http://localhost:3002";

//getting the all opted user from the gupshup API
router.post("/optedinUsers", async (req, res) => {
  const {userId} = req.body;

  let managerDel;
  await axios.post(`${baseUserSystemURL}/indi_user`, {userId}, {validateStatus: false, withCredentials: true}).then((response) => {
    if(response.status === 200){
      managerDel = response.data.foundUser;
    }
  });

  const users = await allOtpedUsers(managerDel.appName, managerDel.apiKey);

  res.status(200).json({users});
})

//getting all the aproved templates from the gupshup API
router.post("/aprovedTemplates", async (req, res) => {
  const {userId} = req.body;

  let managerDel;
  await axios.post(`${baseUserSystemURL}/indi_user`, {userId}, {validateStatus: false, withCredentials: true}).then((response) => {
    if(response.status === 200){
      managerDel = response.data.foundUser;
    }
  });

  const templates = await allAprovedTemplates(managerDel.appName, managerDel.apiKey);
  res.status(200).json({templates});
});

//broadcasting message to all the numbers specified by the manager
router.post("/broadcastMessage", async (req, res) => {
  console.log("Broadcasting");
  const {message, toBeBroadcastNo, userId} = req.body;

  let managerDel;
  await axios.post(`${baseUserSystemURL}/indi_user`, {userId}, {validateStatus: false, withCredentials: true}).then((response) => {
    if(response.status === 200){
      managerDel = response.data.foundUser;
    }
  });

  for(let phoneNo of toBeBroadcastNo){
    if(phoneNo !== ""){
      await broadcastMessage(message, phoneNo, managerDel.assignedNumber, managerDel.appName, managerDel.apiKey);
    }
  }
  res.send("Broadcasting Done");
})

//route for getting all the stored customers
router.get("/storedCustomers", async (req, res) => {
  const allCustomers = await Customer.find();
  if(allCustomers){
    res.status(200).json({users: allCustomers});
  }else{
    console.log("Some Error!!!");
  }
})


//getting all the templated from the database
router.get("/get_all_templates", async (req, res) => {
  const allTemplates = await Template.find();

  if(allTemplates){

    let pendingAtTop = [];
    let pendingIndex = 0, submittedIndex = 0;
    for(let template of allTemplates){
      if(template.status === "Pending"){
        pendingAtTop.unshift(template);
        pendingIndex++;
      }else if(template.status === "Submitted"){
        pendingAtTop.splice(pendingIndex, 0, template);
        submittedIndex++;
      }else{
        pendingAtTop.splice(pendingIndex+submittedIndex, 0, template);
      }
    }

    return res.status(200).json({allTemplates: pendingAtTop});
  }
  return res.status(404).send("Templates not found");

});

//updating the status of the templates stored in the database
router.post("/updateTempStatus", async (req, res) => {
  const {tempID, status} = req.body;

  const template = await Template.findOne({_id: tempID});

  if(template){
    template.status = status;
    template.save((err) => {
      if(!err){
        return res.status(200).send("Status Changed");
      }
    })
  }
});

// @description   route  for creating new flow
// Method  Post

router.post("/createnewflow",async(req,res)=>{
  let {msg_array,contact_list,triggers,time_delay}=req.body; // recieving details of messages contact list and triggers also time delay

  // time_delay is comming in miliseconds

      const flowData=new Flow({
        messages:msg_array,
        contactList:contact_list,
        triggers:triggers,
        timeDelay:time_delay
      });


      await flowData.save();
      console.log(flowData);
      // flowData.save(( err,data)=>{
      //   if(err)
      // })
      res.status(200).json({
        data:flowData
      })


}
)

module.exports = router
