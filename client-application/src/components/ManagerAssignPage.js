import React, {useState, useEffect} from 'react'
import axios from "axios";

import Sidebar from "./uiComponent/sidebar/index";
import TopCon from "./uiComponent/TopCon";

const ManagerAsignPage = ({
  socket,
  baseUserSystemURL,
  baseChatSystemURL,userName,
  userId,
  setIsLogedin,
  noOfRequestedChats
}) => {

      //defining state variables
      const [activeRooms, setActiveRooms] = useState([]);
      const [activeAgents, setActiveAgents] = useState([]);

      //This is for assigning Agents to chat with specific customer
      const assign = async (e) => {
        const room = e.target.parentElement.firstChild.innerText;

        const agentSelect = e.target.parentElement.querySelector(".agentSelect");
        const agent = activeAgents[agentSelect.selectedIndex];

        await axios.post(`${baseChatSystemURL}/assign_agent`, {room, agentEmail: agent.email, assignedBy: userName}, {validateStatus: false, withCredentials: true}).then((response) => {
          if(response.status === 200){
            console.log("Assignment Done");

          }else{
            console.log("Failed");
          }
        });
      }

      //Getting all active rooms exist currently
      const getRooms = async () => {
        await axios.get(`${baseChatSystemURL}/active_rooms`, { validateStatus: false, withCredentials: true }).then((response) => {
          let rooms = response.data.chats;
          // console.log(rooms);
          for(let i=0; i < rooms.length; i++){
            if(rooms[i].managerID !== userId){
              rooms.splice(i, 1);
            }
          }
          setActiveRooms(rooms);
        });
      }

      //function for getting all the current active agents
      const getActiveAgents = async () => {
        await axios.get(`${baseChatSystemURL}/active_agents`, { validateStatus: false, withCredentials: true }).then((response) => {
          setActiveAgents(() => {
            return response.data.activeAgents.filter((agent) => {
              return agent.creatorUID === userId
            })
          });
        });
      }

      useEffect(() => {
        getRooms();
        getActiveAgents();
      }, []);

      useEffect(() => {
        //broadcast is used for dynamiclly updating if there is any change in socket
        socket.on("broadcast", (data) => {
          getRooms();
          setTimeout(getActiveAgents, 500);
        });
      }, [socket])

      return (
          <div className="rootCon">
          <Sidebar role = "Manager" baseURL={baseUserSystemURL} setIsLogedin={setIsLogedin} page="assignAgents" noOfRequestedChats={noOfRequestedChats}/>

            <div className="dataCon">
              <TopCon userName={userName} page="Assign Agents"/>

              <div className="userCon">
                {activeRooms.map((room, index) => {
                  return (
                    <div className="userCard assignCard">
                      <span className="roomTitle">{room.room}</span>
                      <select className="agentSelect">
                        {activeAgents.map((agent, index) => {
                            return (
                              <option value={agent.email}>{agent.name}</option>
                            )
                        })}
                      </select>
                      <button className="rmBtn assignBtn" onClick={assign}>Assign</button>
                    </div>
                  )
                })}
              </div>

            </div>

          </div>
        )
}

export default ManagerAsignPage;
