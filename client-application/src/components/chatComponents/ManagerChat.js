import React, { useState, useEffect } from "react";
import "./ChatPage.css";
import axios from "axios";

import Chat from "./Chat";
import Sidebar from "../uiComponent/sidebar/index";
import TopCon from "../uiComponent/TopCon";


function ManagerChat({socket, userData, baseUserSystemURL, baseChatSystemURL, setIsLogedin, noOfRequestedChats}) {

    //defining state variables
    const [assignedChats, setAssignedChats] = useState([]);//store assigned rooms to agents

    const [currJoinedChats, setCurrJoinedChats] = useState([]);
    const [currActiveChat, setCurrActiveChat] = useState({
      room: "",
      phoneNo: "",
      messageList: []
    });



    //Getting all assigned rooms to this agent
    const getAssignedChats = async () => {

      //getting escalated chats for this manager
      await axios.get(`${baseChatSystemURL}/assigned`, { validateStatus: false, withCredentials: true }).then((response) => {
        //Filtering escalated rooms for this perticular manager
        setAssignedChats(() => {
          return response.data.assignList.filter((assined) => {
            return assined.managerID === userData.user_id
          });
        });

      });
    }

    //function for disconnecting the chat
    const disconnect = async (room) => {

      await socket.emit("disconnect_chat", {chat: currActiveChat, agentName: userData.name, managerID: userData.user_id});

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
      getAssignedChats();

      // sessionStorage.removeItem('currJoinedChats');

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
        setTimeout(() => {
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

          <Sidebar role="Manager" baseURL={baseUserSystemURL} setIsLogedin={setIsLogedin} page="chat" noOfRequestedChats={noOfRequestedChats}/>


          <div className="dataCon">
            <TopCon userName={userData.name} page="Chat Requests"/>

              <div className="activeChatsCon">
                <div>
                  <h3>Escalated Chats</h3>

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

                        <button className="rmBtn disBtn" onClick={(e) => {
                          disconnect(currActiveChat.room);
                        }}>Disconnect</button>
                      </div>
                      <Chat
                        socket={socket}
                        username="Manager"
                        uID={userData.user_id}
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

export default ManagerChat;
