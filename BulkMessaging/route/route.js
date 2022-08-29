const express = require("express");
const router = express.Router();

const axios = require("axios").default;
const {
  URLSearchParams
} = require('url');

const {
  allOtpedUsers,
  allAprovedTemplates
} = require("../helpers/getUsersOrTemplate");

const {
  broadcastMessage
} = require("../helpers/broadcastMessage");

const {
  makeUserOptedin
} = require("../helpers/optinUser");


const Customer = require("../model/customer");
const Template = require("../model/template");
const Flow = require("../model/flow");
const Campaign = require("../model/campaign");


const baseUserSystemURL = "http://localhost:3002";
const baseChatSystemURL = "http://localhost:3001";

//getting the all opted user from the gupshup API
router.post("/optedinUsers", async (req, res) => {
  const {
    userId
  } = req.body;

  let managerDel;
  await axios.post(`${baseUserSystemURL}/indi_user`, {
    userId
  }, {
    validateStatus: false,
    withCredentials: true
  }).then((response) => {
    if (response.status === 200) {
      managerDel = response.data.foundUser;
    }
  });

  const users = await allOtpedUsers(managerDel.appName, managerDel.apiKey);

  res.status(200).json({
    users
  });
})

//getting all the aproved templates from the gupshup API
router.post("/aprovedTemplates", async (req, res) => {
  const {
    userId
  } = req.body;

  let managerDel;
  await axios.post(`${baseUserSystemURL}/indi_user`, {
    userId
  }, {
    validateStatus: false,
    withCredentials: true
  }).then((response) => {
    if (response.status === 200) {
      managerDel = response.data.foundUser;
    }
  });

  const templates = await allAprovedTemplates(managerDel.appName, managerDel.apiKey);
  res.status(200).json({
    templates
  });
});

//broadcasting message to all the numbers specified by the manager
router.post("/broadcastMessage", async (req, res) => {
  const {
    message,
    toBeBroadcastNo,
    userId
  } = req.body;

  await axios.post(`${baseChatSystemURL}/updateBotChatByBroadcasting`, {
    numberList: toBeBroadcastNo
  }, {
    validateStatus: false,
    withCredentials: true
  }).then((response) => {
    console.log(response.data);
  });

  let managerDel;
  await axios.post(`${baseUserSystemURL}/indi_user`, {
    userId
  }, {
    validateStatus: false,
    withCredentials: true
  }).then((response) => {
    if (response.status === 200) {
      managerDel = response.data.foundUser;
    }
  });

  for (let phoneNo of toBeBroadcastNo) {
    if (phoneNo !== "") {
      await makeUserOptedin(phoneNo, managerDel.appName, managerDel.apiKey);
      await broadcastMessage(message, phoneNo, managerDel.assignedNumber, managerDel.appName, managerDel.apiKey);
    }
  }
  res.send("Broadcasting Done");
})

//route for getting all the stored customers
router.get("/storedCustomers", async (req, res) => {
  const allCustomers = await Customer.find();
  if (allCustomers) {
    res.status(200).json({
      users: allCustomers
    });
  } else {
    console.log("Some Error!!!");
  }
})


//getting all the templated from the database
router.get("/get_all_templates", async (req, res) => {
  const allTemplates = await Template.find();

  if (allTemplates) {

    let pendingAtTop = [];
    let pendingIndex = 0,
      submittedIndex = 0;
    for (let template of allTemplates) {
      if (template.status === "Pending") {
        pendingAtTop.unshift(template);
        pendingIndex++;
      } else if (template.status === "Submitted") {
        pendingAtTop.splice(pendingIndex, 0, template);
        submittedIndex++;
      } else {
        pendingAtTop.splice(pendingIndex + submittedIndex, 0, template);
      }
    }

    return res.status(200).json({
      allTemplates: pendingAtTop
    });
  }
  return res.status(404).send("Templates not found");

});

//updating the status of the templates stored in the database
router.post("/updateTempStatus", async (req, res) => {
  const {
    tempID,
    status
  } = req.body;

  const template = await Template.findOne({
    _id: tempID
  });

  if (template) {
    template.status = status;
    template.save((err) => {
      if (!err) {
        return res.status(200).send("Status Changed");
      }
    })
  }
});

// @description   route  for creating new flow
// Method  Post

router.post("/create_new_flow", async (req, res) => {
  const {
    title,
    tMessageList,
    contactList,
    cid,
    startNode,
    nodes,
    edges
  } = req.body; // recieving details of messages contact list and triggers also time delay

    const flowData = new Flow({
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
    });


    await flowData.save();

    for(let phNum of contactList){

      const customer = await Customer.findOne({userPhoneNo: phNum});

      customer.allFLows = [...customer.allFLows, flowData._id.toString()];

      if(!customer.currFlow || customer.currFlow.currPos.temp === "!end"){
        customer.currFlow = {
            flowID: flowData._id.toString(),
            currPos: {
              temp: startNode,
              show: true
            }
          }
      }
      await customer.save();
    }
  res.status(200).json({
    data: flowData
  });
});

router.post("/getFlow", async (req, res) => {
  try {
    const {flowID} = req.body;
    const foundFlow = await Flow.findOne({_id: flowID});

    res.status(200).json({foundFlow});
  } catch (e) {
    console.log(e);
    res.end();
  }
})

router.post("/getflows", async (req, res) => {
  try{
    const {managerId} = req.body;

    const foundFlows = await Flow.find({cid: managerId});
    res.status(200).json({flows: foundFlows});
  }catch(e){
    console.log(e);
    res.end();
  }

});

router.post("/create_new_campaign", async (req, res) => {
  const {
    title,
    tFlowList,
    contactList,
    cid,
    startFlow
  } = req.body;

  const campaignData = new Campaign({
    title,
    tFlowList,
    contactList,
    cid,
    startFlow
  });

  await campaignData.save();

  for(let phNum of contactList){

    const customer = await Customer.findOne({userPhoneNo: phNum});

    customer.currCampaign = {
      campaignID: campaignData._id.toString(),
      currFlowID: startFlow
    }
    await customer.save();
  }

  res.status(200).json({
    data: campaignData
  });
})

module.exports = router
