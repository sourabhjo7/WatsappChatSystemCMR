import React, {useState, useEffect} from 'react';
import axios from "axios";

import "./DB.css";

//importing charts
import DoughnutChart from "../charts/DoughnutChart"
import ManagerBar from "../charts/ManagerBar"
import ManagerLine from "../charts/ManagerLine"

//importing UI Components
import Sidebar from "../uiComponent/Sidebar";
import TopCon from "../uiComponent/TopCon";

function ManagerDb({baseUserSystemURL, baseChatSystemURL, setIsLogedin, userData, noOfRequestedChats, socket}) {
    //defining state variables
    const [totalNoOfAgents, setTotalNoOfAgents] = useState(0);
    const [totalNoOfActiveAgents, setTotalNoOfActiveAgents] = useState(0);
    const [totalNoOfOpenChats, setTotalNoOfOpenChats] = useState(0);

    const [totalNoOfEscalations, setTotalNoOfEscalations] = useState(0);
    const [totalNoOfTemplates, setTotalNoOfTemplates] = useState(0);
    const [totalNoOfCompletedChats, setTotalNoOfCompletedChats] = useState(0);

    const [totalEscalations, setTotalEscalations] = useState([]);
    const [totalTemplates, setTotalTemplates] = useState([]);
    const [totalCompletedChats, setTotalCompletedChats] = useState([]);

    const [showBar, setShowBar] = useState(true);

    //function for getting all the agents from the database
    const getAgents = async () => {
      await axios.get(`${baseUserSystemURL}/agents`, { validateStatus: false, withCredentials: true }).then((response) => {
        const allAgents = response.data.agents;

        const allAgentsOfThisManager = allAgents.filter((agent) => {
          return agent.creatorUID === userData.user_id
        })

        setTotalNoOfAgents(allAgentsOfThisManager.length);
      });
    }

    //function for getting all the active agents
    const getActiveAgents = async () => {

      await axios.get(`${baseChatSystemURL}/active_agents`, { validateStatus: false, withCredentials: true }).then((response) => {
        const allActiveAgentsOfThisManager = response.data.activeAgents.filter((agent) => {
          return agent.creatorUID === userData.user_id
        })

        setTotalNoOfActiveAgents(allActiveAgentsOfThisManager.length);
      });
    }

    //function for getting all the active rooms
    const getRooms = async () => {
      await axios.get(`${baseChatSystemURL}/active_rooms`, { validateStatus: false, withCredentials: true }).then((response) => {
        let rooms = response.data.chats;

        //removing rooms which are not for this perticular manager
        for(let i=0; i < rooms.length; i++){
          if(rooms[i].managerID !== userData.user_id){
            rooms.splice(i, 1);
          }
        }
        setTotalNoOfOpenChats(rooms.length);
      });
    }

    //function for getting all the escalations of this perticular manager
    const getEscalations = async () => {
      await axios.post(`${baseUserSystemURL}/get_escalations`, {managerID: userData.user_id},{ validateStatus: false, withCredentials: true }).then((response) => {
        setTotalEscalations(response.data.escalations);
        setTotalNoOfEscalations(response.data.escalations.length);
      });
    }

    //function for getting all the templates from the database
    const getTemplates = async() => {
      await axios.post(`${baseChatSystemURL}/allTemplatesByManager`, {managerID: userData.user_id},{ validateStatus: false, withCredentials: true }).then((response) => {
        setTotalTemplates(response.data.templates);
        setTotalNoOfTemplates(response.data.templates.length);
      });
    }

    //function for getting all the completed chats from the database
    const getCompletedChats = async () => {
      await axios.post(`${baseChatSystemURL}/completedChats`, {managerID: userData.user_id},{ validateStatus: false, withCredentials: true }).then((response) => {
        setTotalCompletedChats(response.data.chats);
        setTotalNoOfCompletedChats(response.data.chats.length);
      });
    }

    //filtering data based on time
    const filterData = (selectedFilter) => {
      const currentDate = new Date().getTime();

      let noOfEscalations= 0, noOfTemplates = 0, noOfCompletedChats = 0;

      if(selectedFilter === "all"){

        noOfEscalations = totalEscalations.length;
        noOfTemplates = totalTemplates.length;
        noOfCompletedChats = totalCompletedChats.length;

      }else{
        let comparedDate;

        if(selectedFilter === 7){
          comparedDate = currentDate - 7*24*60*60*1000;
        }else if(selectedFilter === 30){
          comparedDate = currentDate - 30*24*60*60*1000;
        }

        for(let ecalation of totalEscalations){
          if(ecalation.date >= comparedDate){
            noOfEscalations++
          }
        }
        for(let template of totalTemplates){
          if(template.creationDate >= comparedDate){
            noOfTemplates++
          }
        }
        for(let chat of totalCompletedChats){
          if(chat.lastInteraction >= comparedDate){
            noOfCompletedChats++
          }
        }
      }

      setTotalNoOfEscalations(noOfEscalations);
      setTotalNoOfTemplates(noOfTemplates);
      setTotalNoOfCompletedChats(noOfCompletedChats);
    }

    const featchData = () => {
      getAgents();
      getActiveAgents();
      getRooms();
      getEscalations();
      getTemplates();
      getCompletedChats();
    }

    useEffect(() => {
      featchData();
    }, []);


    useEffect(() => {
      //updating data on broadcast
      socket.on("broadcast", (data) => {
        setTimeout(() => {
          featchData();
        }, 500);
      });
    }, [socket])

    return (
        <div className="rootCon">
          <Sidebar role="Manager" baseURL={baseUserSystemURL} setIsLogedin={setIsLogedin} page="overview" noOfRequestedChats={noOfRequestedChats}/>
          <div className="dataCon">
            <TopCon userName={userData.name} page="Overview"/>

            <div className="dashBoard">

              <div className="firstCon">

                <div className="upCon">

                <div className="upConFirstCon">
                  <a href="/agents">
                    <div className="divInA">
                      <p className="upConHeading">Agents</p>
                      <span>{totalNoOfAgents}</span>
                    </div>
                  </a>

                  <a href="/asign_agent">
                    <div className="divInA">
                      <p className="upConHeading">Active Agents</p>
                      <span>{totalNoOfActiveAgents}</span>
                    </div>
                  </a>


                  <a href="/asign_agent">
                    <div className="divInA">
                      <p className="upConHeading">Unresponded Chats</p>
                      <span>{totalNoOfOpenChats}</span>
                    </div>
                  </a>
                </div>



                  <p className="filterSelect">
                      <select onChange={(e) => {
                        filterData(e.target.value)
                      }}>
                        <option value="all">All Time</option>
                        <option value="7">Past 7 Days</option>
                        <option value="30">Past 30 Days</option>
                      </select>
                  </p>

                  <div className="upConFirstCon">
                    <a href="/chat_requests">
                      <div className="divInA">
                        <p className="upConHeading">Escalated Chats</p>
                        <span>{totalNoOfEscalations}</span>
                      </div>
                    </a>

                    <a href="/new_template_request">
                      <div className="divInA">
                        <p className="upConHeading">Template Created</p>
                        <span>{totalNoOfTemplates}</span>
                      </div>
                    </a>

                    <a href="/">
                      <div className="divInA">
                        <p className="upConHeading">Completed Chats</p>
                        <span>{totalNoOfCompletedChats}</span>
                      </div>
                    </a>
                  </div>



                </div>

                <div className="chartsCon">
                  <div className="doughnutChart">
                    <DoughnutChart exData = {{
                      agent: totalNoOfAgents,
                      activeAgent: totalNoOfActiveAgents
                    }}/>

                  </div>

                  <select onChange={(e) => {
                    console.log(e.target.value);
                    if(e.target.value === "bar"){
                      setShowBar(true);
                    }else{
                      setShowBar(false);
                    }
                  }}>
                    <option value="bar">Bar</option>
                    <option value="line">Line</option>
                  </select>

                  <div className="managerLineChart">
                    {showBar ? (
                      <ManagerBar
                        totalEscalations={totalEscalations}
                        totalTemplates={totalTemplates}
                        totalCompletedChats={totalCompletedChats}
                      />
                    ): (
                      <ManagerLine
                        totalEscalations={totalEscalations}
                        totalTemplates={totalTemplates}
                        totalCompletedChats={totalCompletedChats}
                      />
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
    )
}

export default ManagerDb;
