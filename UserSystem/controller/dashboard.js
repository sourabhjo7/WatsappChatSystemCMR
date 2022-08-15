const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require("../model/user");

//linked to /
exports.home = (req, res) => {
  res.status(200).json({
    user: req.userData
  });
}

//linked to /agents
exports.agents = async (req, res) => {

  try {

    await User.find({
      role: "Agent"
    }, (err, foundAgents) => {

      for (let agent of foundAgents) {
        agent.password = undefined;
      }

      return res.status(200).json({
        agents: foundAgents
      });
    }).clone();

  } catch (e) {
    console.log(e);
  }

}

//linked to /indi_user
exports.indiUser = async (req, res) => {

  //Getting Id and role from the body of the request
  const {
    userId, appName
  } = req.body;

  try {

    //checking if userId exist, if not getting user by appName
    if(userId){
      await User.findOne({
        _id: userId
      }, (err, foundUser) => {
        if (!foundUser) {
          return res.status(404).send("User not found");
        } else {
          foundUser.password = undefined;
          return res.status(200).json({
            foundUser
          });
        }
      }).clone();
    }else{
      await User.findOne({
        appName
      }, (err, foundUser) => {
        if (!foundUser) {
          return res.status(404).send("User not found");
        } else {
          foundUser.password = undefined;
          return res.status(200).json({
            foundUser
          });
        }
      }).clone();
    }


  } catch (e) {
    console.log(e);
  }
}

//linked to /managers
exports.managers = async (req, res) => {

  try {

    await User.find({
      role: "Manager"
    }, (err, foundManagers) => {
      return res.status(200).json({
        managers: foundManagers
      });
    }).clone();

  } catch (e) {
    console.log(e);
  }

}

//linked to /del_agent
exports.delAgent = async (req, res) => {

  try {

    const agentID = req.body.userID;


    await User.findByIdAndRemove(agentID, function(err, data) {
      if (!err) {
        data.password = undefined;
        return res.status(200).json({
          DeletedAgent: data
        });
      }
    });

  } catch (e) {
    console.log(e);
  }

}

//linked to /del_manager
exports.delManager = async (req, res) => {

  try {

    const managerId = req.body.userID;

    await User.findByIdAndRemove(managerId, function(err, data) {
      if (!err) {
        data.password = undefined;
        res.status(200).json({
          DeletedManager: data
        });
      }
    });

  } catch (e) {
    console.log(e);
  }

}

//linked to /change_name
exports.changeName = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      assignedNumber,
      appName,
      apiKey
    } = req.body;

    await User.findOne({
      email
    }, async (err, foundUser) => {
      if (foundUser) {
        foundUser.firstName = firstName;
        foundUser.lastName = lastName;
        if(foundUser.role === "Manager"){
          foundUser.assignedNumber = assignedNumber;
          foundUser.appName = appName;
          foundUser.apiKey = apiKey;
        }

        foundUser.save(async (err) => {
          if (!err) {
            let data = await jwt.verify(req.cookies.token, process.env.SECRET_KEY);
            data = {
              ...data,
              name: firstName + " " + lastName
            }

            //changing the token in frontend so that changed nane got auto updated
            const token = jwt.sign({
                ...data
              },
              process.env.SECRET_KEY
            );

            // Setting Up cookies
            const options = {
              expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
              httpOnly: true
            };

            foundUser.password = undefined;
            return res.status(200).cookie('token', token, options).json({
              user: foundUser
            })
          }
        });
      } else {
        return res.status(404).send("User Not Found");
      }
    }).clone()
  } catch (e) {
    console.log(e);
  }
}

//linked to /change_password
exports.changePassword = async (req, res) => {
  try {
    const {
      password,
      email
    } = req.body;

    const user = await User.findOne({
      email
    });
    if (user) {
      const encPassword = await bcrypt.hash(password, 10);
      user.password = encPassword;

      user.save((err) => {
        if (!err) {
          res.status(200).send("Password Changed");
        }
      })
    }
  } catch (e) {
    console.log(e);
  }
}

//linked to /new_escalation
exports.newEscatation = async (req, res) => {
  const {room, customerPhoneNo, escalatedBy, managerID} = req.body;

  const date = new Date().getTime();
  const foundManager = await User.findOne({_id: managerID});

  if(foundManager.escalations){
    foundManager.escalations = [...foundManager.escalations, {
      customerName: room,
      customerPhoneNo,
      escalatedBy,
      date
    }]
  }else{
    foundManager.escalations = {
      customerName: room,
      customerPhoneNo,
      escalatedBy,
      date
    }
  }

  await foundManager.save((err) => {
    if(err){
      res.status(400).send(err);
    }else{
      res.status(200).send("Done");
    }
  });

}

//linked to /get_escalations
exports.getEscatations = async (req, res) => {
  const {managerID} = req.body;

  const foundManager = await User.findOne({_id: managerID});
  if(foundManager){
    res.status(200).json({escalations: foundManager.escalations});
  }else{
    res.status(200).json({escalations: []});
  }

}
