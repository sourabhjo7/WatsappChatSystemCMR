import React, { useState, useEffect } from "react";

import Sidebar from "./uiComponent/sidebar/index";
import TopCon from "./uiComponent/TopCon";
import {
  callActiveagents,
  callActiverooms,
  callassignAgent,
} from "../Services/Api";

const ManagerAsignPage = ({
  socket,
  userName,
  userId,
  setIsLogedin,
  noOfRequestedChats,
}) => {
  //defining state variables
  const [activeRooms, setActiveRooms] = useState([]);
  const [activeAgents, setActiveAgents] = useState([]);

  //This is for assigning Agents to chat with specific customer
  const assign = async (e) => {
    const room = e.target.parentElement.firstChild.innerText;

    const agentSelect = e.target.parentElement.querySelector(".agentSelect");
    const agent = activeAgents[agentSelect.selectedIndex];

    await callassignAgent(room, agent, userName);
  };

  //Getting all active rooms exist currently
  const getRooms = async () => {
    let rooms = await callActiverooms();
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].managerID !== userId) {
        rooms.splice(i, 1);
      }
    }
    setActiveRooms(rooms);
  };

  //function for getting all the current active agents

  const getActiveAgents = async () => {
    const activeAgents = await callActiveagents();
    setActiveAgents(() => {
      return activeAgents.filter((agent) => {
        return agent.creatorUID === userId;
      });
    });
  };

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
  }, [socket]);

  return (
    <div className="rootCon">
      <Sidebar
        role="Manager"
        setIsLogedin={setIsLogedin}
        page="assignAgents"
        noOfRequestedChats={noOfRequestedChats}
      />

      <div className="dataCon">
        <TopCon userName={userName} page="Assign Agents" />

        <div className="userCon">
          {activeRooms.length == 0 ? (
            <h4 style={{textAlign:"center"}}>No Assigned Agents</h4>
          ) : (
            activeRooms.map((room, index) => {
              return (
                <div className="userCard assignCard">
                  <span className="roomTitle">{room.room}</span>
                  <select className="agentSelect">
                    {activeAgents.map((agent, index) => {
                      return <option value={agent.email}>{agent.name}</option>;
                    })}
                  </select>
                  <button className="rmBtn assignBtn" onClick={assign}>
                    Assign
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerAsignPage;
