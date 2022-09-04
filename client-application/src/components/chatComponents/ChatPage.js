import React, { useState, useEffect } from "react";
import "./ChatPage.css";

import Chat from "./Chat";
import Sidebar from "../uiComponent/sidebar/index";
import TopCon from "../uiComponent/TopCon";
import { callActiveagents, callActiverooms, callAssignedChats, newescalation } from "../../Services/Api";


function ChatPage({socket, userData, baseUserSystemURL, baseChatSystemURL, setIsLogedin}) {

    //defining state variables
    const [activeRooms, setActiveRooms] = useState([]);//store all active romms exist
    const [assignedChats, setAssignedChats] = useState([]);//store assigned rooms to agents
    const [activeAgents, setActiveAgents] = useState([]);

    const [currJoinedChats, setCurrJoinedChats] = useState([]);
    const [currActiveChat, setCurrActiveChat] = useState({
      room: "",
      phoneNo: "",
      messageList: []
    });

    //function for getting all the current active agents
    const getActiveAgents = async () => {
     const activeAgents= await callActiveagents(baseChatSystemURL)
     await setActiveAgents( () => {
      return activeAgents.filter((agent) => {
        return agent.email !== userData.email && agent.creatorUID === userData.creatorUID
      })
    });
    }

    //Getting all active rooms exist currently
    const getRooms = async () => {
      const rooms=await callActiverooms(baseChatSystemURL);
      // console.log(rooms);
      for(let i=0; i < rooms.length; i++){
        if(rooms[i].managerID !== userData.creatorUID){
          rooms.splice(i, 1);
        }
      }
      setActiveRooms(rooms);
    }

    //Getting all assigned rooms to this agent
    const getAssignedChats = async () => {

      const assignList=await callAssignedChats(baseChatSystemURL);
       //Filtering assigned rooms for this perticular agent
       setAssignedChats(() => {
        return assignList.filter((assined) => {
          return assined.agentEmail === userData.email
        });
      });
    }

    //function for disconnecting the chat
    const disconnect = async (room) => {

      await socket.emit("disconnect_chat", {chat: currActiveChat, agentName: userData.name, managerID: userData.creatorUID});

      currJoinedChats.forEach((chat, index) => {
        if(chat.room === room){
          setCurrJoinedChats((curr) => {
            console.log(curr.splice(index, 1));
            return [...curr]
          })
        }
      })

      if(currJoinedChats.length > 0){
        setCurrActiveChat(currJoinedChats[0]);
      }else{
        setCurrActiveChat({
          room: "",
          messageList: [],
          phoneNo: "",
        });
      }

    }

    //function for reassigning the chat (also using for escalations)
    const reassign = async (e, action, room) => {

      let agent, managerID;
      if(action === "reassign"){//if action is reassign
        const agentSelect = e.target.parentElement.querySelector(".agentSelect");

        agent = activeAgents[agentSelect.selectedIndex];
        if(agent){
          await socket.emit("reassign", {room, agentEmail: agent.email, phoneNo: currActiveChat.phoneNo, assignedBy: userData.name});
        }

      }else{//if action is escalation
        managerID = userData.creatorUID;

        //Adding ecalation to DB
       await newescalation(baseUserSystemURL,room,currActiveChat.phoneNo,userData.name,managerID);

        await socket.emit("reassign", {room, managerID, phoneNo: currActiveChat.phoneNo, assignedBy: userData.name});
      }

      if(agent !== undefined || managerID !== undefined){
        await socket.emit("disconnect_chat", {chat: currActiveChat, agentName: userData.name, managerID: userData.creatorUID});

        currJoinedChats.forEach((chat, index) => {
          if(chat.room === room){
            setCurrJoinedChats((curr) => {
              curr.splice(index, 1);
              return [...curr]
            })
          }
        })

        if(currJoinedChats.length > 0){
          setCurrActiveChat(currJoinedChats[0]);
        }else{
          setCurrActiveChat({
            room: "",
            messageList: [],
            phoneNo: "",
          });
        }
      }else{
        console.log("No agent Selected");
      }
    }

    //component for pupulating reassign functionality
    const ReassignCom = ({room}) => {
      return <div>
        <select className="agentSelect">
          {activeAgents.map((agent, index) => {
              return (
                <option key={index} value={agent.email}>{agent.name}</option>
              )
          })}
        </select>
        <button className="joinbtn" onClick={(e) => {
          reassign(e, "reassign", `${room}`);
        }}>Reassign</button>
      </div>
    }

    //function for joining a new room/chat
    const joinRoom = async (room) => {
      if (room !== "") {

        await socket.emit("join_room", {room, email: userData.email});
      }
    };

    //function for changing the chat form the currJoinedChats
    const changeChat = async (room) => {

      for(let i = 0; i < currJoinedChats.length; i++){
        if(currJoinedChats[i].room === currActiveChat.room){

          //if a chat has changed adding the updated current chat to the currJoinedChats
          await setCurrJoinedChats((curr) => {
            curr.splice(i, 1, currActiveChat);
            return [...curr]
          })
          break;
        }
      }

      //updating the current active chat with the new changed chat
      await currJoinedChats.forEach((chat) => {
        if(chat.room === room){
          setCurrActiveChat((curr) => {
            return {...curr, room: chat.room, phoneNo: chat.phoneNo, messageList: chat.messageList}
          });
        }
      });

    }

    useEffect(() => {

      //emitting the "Agent so that current active agents can get updated in the backend"
      socket.emit("Agent", {email: userData.email, name: userData.name, socket_id: socket.id, creatorUID: userData.creatorUID});

      getRooms();
      getAssignedChats();
      getActiveAgents();

      //getting the currJoinedChats form thr sessionStorage
      const chats = sessionStorage.getItem("currJoinedChats");
      if(chats != null){
        setCurrJoinedChats(JSON.parse(chats));
      }else{
        console.log("Chats not exist");
      }
    }, []);

    useEffect(() => {
      //broadcast is used for dynamiclly updating if there is any change in socket
      socket.on("broadcast", (data) => {
        getRooms();
        setTimeout(() => {
          getActiveAgents();
          getAssignedChats();
        }, 500);
      });

      //Populating message sent before agent joined room
      socket.on("room_joined", (data) => {

        const messageList = [];
        data.messages.forEach((message, index) => {

          const messageData = {
            room: data.room,
            author: data.room,
            message: message,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
          };

          messageList.push(messageData);
        })

        setCurrJoinedChats((curr) => {
          return [...curr, {room: data.room, phoneNo: data.phoneNo, messageList}]
        })
        if(currActiveChat.room === ""){
          setCurrActiveChat({
            room: data.room,
            phoneNo: data.phoneNo,
            messageList
          })
        }

      })

    }, [socket]);

    useEffect(() => {

      //setting the curr Chats in the session
      sessionStorage.setItem("currJoinedChats", JSON.stringify(currJoinedChats));

      //joining all the rooms that were previously joined
      for(let chat of currJoinedChats){
        socket.emit("join_room", {room: chat.room, email: userData.email});
      }

      //setting the active chat with the most relaible chat
      if(currActiveChat.room === "" && currJoinedChats[0]){
        setCurrActiveChat({
          room: currJoinedChats[0].room,
          phoneNo: currJoinedChats[0].phoneNo,
          messageList: currJoinedChats[0].messageList
        });
      }
    }, [currJoinedChats])

    return (
        <div className="rootCon">

          <Sidebar role="Agent" baseURL={baseUserSystemURL} setIsLogedin={setIsLogedin} page="chat" />


          <div className="dataCon">
            <TopCon userName={userData.name} page="Chat Requests"/>

              <div className="activeChatsCon">
                <div>
                  <h3>Assigned Chats</h3>

                  <div className="chatList">
                    {assignedChats.map((chat, index) => {
                      return (
                        <div key={index}>
                          <span>{chat.room}</span>
                          <span>{chat.assignedBy}</span>
                          <button className="joinbtn" onClick={() => {
                            joinRoom(chat.room);
                          }}>Join</button>
                        </div>
                      )
                    })}
                  </div>

                </div>


                <div>
                  <h3>Available Chats</h3>

                  <div className="chatList">
                    {activeRooms.map((room, index) => {
                      return (
                        <div key={index}>
                          {room.room}
                          <button className="joinbtn" onClick={() => {
                            joinRoom(room.room)
                          }}>Join</button>
                        </div>
                      )
                    })}
                  </div>

                </div>
              </div>

              <div className="Chats">
                <div className="chatsListCon">
                  {currJoinedChats.map((chat, index) => {
                    return <div onClick={() => {
                      changeChat(chat.room);
                    }} key={index} className="chatsList">{chat.room}</div>
                  })}
                </div>

                <div className="chatsCon">
                  {currActiveChat.room !== "" ? (
                    <div className="chatCon">
                      <div className="chatTopCon">
                        <span>{currActiveChat.room}</span>
                        <ReassignCom room={currActiveChat.room} />

                        <button className="joinbtn" onClick={(e) => {
                          reassign(e, "escToManager", `${currActiveChat.room}`);
                        }}>Escalate to Manager</button>

                        <button className="rmBtn disBtn" onClick={(e) => {
                          disconnect(currActiveChat.room);
                        }}>Disconnect</button>
                      </div>
                      <Chat
                        socket={socket}
                        username="Agent"
                        creatorUID={userData.creatorUID}
                        currActiveChat={currActiveChat}
                        setCurrActiveChat={setCurrActiveChat}
                        currJoinedChats={currJoinedChats}
                        setCurrJoinedChat={setCurrJoinedChats}
                      />
                    </div>
                  ) : (
                    <></>
                  )}

                </div>
              </div>
          </div>

        </div>
    )
}

export default ChatPage;
