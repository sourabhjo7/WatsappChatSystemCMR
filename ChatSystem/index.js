require("dotenv").config(); //for using environment variables
require("./config/database").connect(); //Setting up the database connection

const express = require("express"); //For creating server
const app = express();
var bodyParser = require('body-parser') //for reading json from form data
const http = require("http");
const cors = require("cors"); //for enabling api requuest from external source
const {
  Server
} = require("socket.io"); //framework to use web sockets

const axios = require("axios").default;
const {
  URLSearchParams
} = require('url');

const PORT = process.env.PORT;

//URL of the chat system
const baseUserSystemURL = "http://localhost:3002";

//requiring the database collections
const Customer = require("./model/customer");
const Template = require("./model/template");
const Chat = require("./model/chat");

//requiring the hepler methods
const activeSocketRooms = require("./helpers/activeSocketRooms");
const { otpedinUser } = require("./helpers/checkUserOptedin");
const {
  sendMessage
} = require("./helpers/sendMessage");

//middleware using cors with options
app.use(cors({
  origin: ['http://localhost:3000', "http://localhost:5000"],
  optionsSuccessStatus: 200,
  credentials: true
}));

//Defining headers for cors
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
});

//middleware using bodyParser
app.use(bodyParser.json());

//creating http server for uing it for socket.io
const server = http.createServer(app);

//creating a new socket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//passing the io to all routes
app.use(function(req, res, next) {
  req.io = io;
  next();
});


let activeChats = []; //store all the current active chats
let activeAgents = []; //store all the active agents in a perticular time
let assignList = []; //store if a agent gets assigned to chat with any specific customer


io.on("connection", (socket) => {

  socket.on("Agent", async (data) => {
    //if the request is comming from an agent passing it into the activeAgnets list
    if(activeAgents.some(agent => agent.email === data.email)){
      console.log("Agent Already In");
    }else{
      await activeAgents.push({
        ...data
      });
    }

  })

  //adding the agent in the Socket room
  socket.on("join_room", async (data) => {
    io.sockets.emit("broadcast", data); //broadcasting so the all active rooms get updated for all users

    //getting all the current active socket rooms
    const roomsWhichHaveAgent = await activeSocketRooms(io);

    //checking if data.room already exist in the active rooms
    const roomIndex = roomsWhichHaveAgent.indexOf(data.room);

    //if data.room didn't exist in the active room genrating the new room
    if (roomIndex === -1) {

      //checking if the chat is from assig list
      if (assignList.length > 0) {
        for (i = 0; i < assignList.length; i++) {
          if (assignList[i].room === data.room) {
            socket.emit("room_joined", assignList[i]);
            assignList.splice(i, 1);
            break;
          }
        }
      }

      // Getting message sent before agent joined the room
      for (i = 0; i < activeChats.length; i++) {
        if (activeChats[i].room === data.room) {
          socket.emit("room_joined", activeChats[i]);
          activeChats.splice(i, 1);
          break;
        }
      }

      socket.join(data.room);
    }
  });


  //listener when a new message will be send from client side
  socket.on("send_message", async (messageData) => {

    let userId, managerDel;

    //getting the managers detail to send message from the specific number
    if(messageData.creatorUID){
      userId = messageData.creatorUID
    }else{
      userId = messageData.uID;
    }

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

    //Sending message
    await sendMessage(messageData.message, messageData.phoneNo, managerDel.assignedNumber, managerDel.appName, managerDel.apiKey);
  });

  //listener for disconnecting connection between customer and chat
  socket.on("disconnect_chat", async (data) => {

    //broadcasting so the all active rooms get updated for all users
    io.sockets.emit("broadcast", {});
    const {
      chat,
      agentName,
      managerID
    } = data;

    let lastInteraction = new Date().getTime();

    //Creating a new Chat Document
    const newChat = await Chat.create({
      customerName: chat.room,
      userPhoneNo: chat.phoneNo,
      messageList: chat.messageList,
      agentName,
      managerID,
      lastInteraction
    });

    //Removing agent from the room
    socket.leave(chat.room);
  })

  //listener for reassigning the chat to another agent
  socket.on("reassign", (data) => {
    io.sockets.emit("broadcast", data); //broadcasting so the all active rooms get updated for all users

    assignList.push({
      room: data.room,
      agentEmail: data.agentEmail,
      managerID: data.managerID,
      assignedBy: data.assignedBy,
      messages: [],
      phoneNo: data.phoneNo
    });

    //removing the current agent from the room, so that a new agent can join
    socket.leave(data.room);
  })

  socket.on("disconnect", async () => {
    io.sockets.emit("broadcast", {});

    //if a avtive agent got Disconnected removing it from the active agents list
    activeAgents = await activeAgents.filter((agent) => {
      return agent.socket_id !== socket.id
    });
  });
});

app.post("/hook", async (req, res) => {
  const {
    type,
    payload
  } = req.body

  //Checking the request is an incoming message form whatsapp
  if (type === 'message') {

    let managerDel;
    await axios.post(`${baseUserSystemURL}/indi_user`, {
      appName: req.body.app
    }, {
      validateStatus: false,
      withCredentials: true
    }).then((response) => {
      if (response.status === 200) {
        managerDel = response.data.foundUser;
      }
    });

    //storing a new user in the database if already not exist
    const user = await Customer.findOne({
      userPhoneNo: payload.source
    });

    if (!user) {
      const newCustomer = Customer.create({
        userName: payload.sender.name,
        userPhoneNo: payload.source
      })
    }

    //method for checking if the user is a optin user and if not making it the optin user
    await otpedinUser(payload.sender.dial_code, payload.sender.phone, managerDel);

    //Checking if an agent is alreday joined the room
    const roomsWhichHaveAgent = await activeSocketRooms(io);

    const roomIndex = roomsWhichHaveAgent.indexOf(payload.sender.name);
    //If an agent is in the room
    if (roomIndex !== -1) {
      const messageData = {
        room: payload.sender.name,
        author: payload.sender.name,
        message: payload.payload.text,
        time: new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await io.to(payload.sender.name).emit("receive_message", messageData);

    } else {
      io.sockets.emit("broadcast", {});

      // Checking if this chat already in the activeChats
      for (let i = 0; i < activeChats.length; i++) {
        if (activeChats[i].room === payload.sender.name) {
          activeChats[i].messages.push(payload.payload.text);
          return res.status(200).end();
        }
      }

      // Checking if this chat already in the assigned chats
      for (let i = 0; i < assignList.length; i++) {
        if (assignList[i].room === payload.sender.name) {
          assignList[i].messages.push(payload.payload.text);
          return res.status(200).end();
        }
      }

      //if chat didn't exist then creating a new one
      activeChats.push({
        room: payload.sender.name,
        messages: [payload.payload.text],
        phoneNo: payload.sender.phone,
        managerID: managerDel._id
      });
    }

  }

  return res.status(200).end();
})

//route for getting all the active rooms exist
app.get("/active_rooms", async (req, res) => {

  // storing active chat names in chats array
  const chats = activeChats;

  //checking if the room didnt already exist in the assignList
  for (i = 0; i < assignList.length; i++) {
    let isExist = false;
    for (j = 0; i < chats.length; j++) {
      if (chats[j].room === assignList[i].room) {
        chats.splice(j, 1);
        isExist = true;
        break;
      }
    }

  }

  res.json({
    chats
  });
})

app.get("/active_agents", (req, res) => {
  res.status(200).json({
    activeAgents
  });
});

//assign agent route used by manager to assign chats to different agents
app.post("/assign_agent", (req, res) => {
  io.sockets.emit("broadcast", {});

  const {
    room,
    agentEmail,
    assignedBy
  } = req.body;

  let phoMessObj = {};
  for (let chat of activeChats) {
    if (chat.room === room) {
      phoMessObj.messages = chat.messages;
      phoMessObj.phoneNo = chat.phoneNo
    }
  }

  assignList.push({
    room,
    agentEmail,
    assignedBy,
    ...phoMessObj
  });

  res.status(200).send("Assigned");

})

//route to get all the chats which are assigned by the manager
app.get("/assigned", (req, res) => {
  res.status(200).json({
    assignList
  });

});

//route for getting all the completed chats
app.post("/completedChats", async (req, res) => {
  const {managerID} = req.body;
  let foundChats;
  if(managerID){
    foundChats = await Chat.find({managerID});
  }else{
    foundChats = await Chat.find({});
  }

  res.status(200).json({chats: foundChats});
});

// Template functionalities

//route for getting number of pending templates
app.get("/noOfPendingTemplates", async (req, res) => {

  //getting all the pending templates from the database
  const pendingTemplates = await Template.find({
    status: "Pending"
  });

  //getting the length of pending templates array
  const noOfPendingTemplates = pendingTemplates.length;

  res.status(200).json({
    noOfPendingTemplates
  });
})

//route for getting all the templates by a preticular manager
app.post("/allTemplatesByManager", async (req, res) => {
  const {managerID} = req.body;

  const foundTemplates = await Template.find({requestByUID: managerID});

  res.status(200).json({templates: foundTemplates});
});

//route for adding a new temoplate request to the database
app.post("/add_new_template", async (req, res) => {
  const {
    name,
    format,
    sample,
    requestByName,
    requestByUID
  } = req.body;

  //sending the whatsapp notification to the admin on a new template request
  sendMessage(`A new template (${name}) is requested by ${requestByName}.`, process.env.ADMIN_NUMBER, process.env.GUPSHUP_TEMP_NOTICATION_NUM, process.env.GUPSHUP_APP_NAME, process.env.GUPSHUP_API_KEY);

  const currentDate = new Date().getTime();

  //creating a new template in the database
  await Template.create({
    name,
    format,
    sample,
    requestByName,
    requestByUID,
    status: "Pending",
    creationDate: currentDate
  });

  //getting all the pending template so that we can return the no of pending template on adding a new template
  const pendingTemplates = await Template.find({
    status: "Pending"
  });
  const noOfPendingTemplates = pendingTemplates.length;

  //emmiting new template so that clint can be auto updated
  await io.emit("new_temp", {
    name,
    requestByName,
    noOfPendingTemplates
  });

  res.status(200).send("Done");

});


server.listen(PORT, () => {
  console.log(`Chat Server Running on Port ${PORT}`);
});
