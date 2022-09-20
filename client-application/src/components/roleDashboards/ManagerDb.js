import React, {useState, useEffect} from 'react';


import "./DB.scss";

//importing charts
import DoughnutChart from "../charts/DoughnutChart"
import ManagerBar from "../charts/ManagerBar"
import ManagerLine from "../charts/ManagerLine"

//importing UI Components
import Sidebar from "../uiComponent/sidebar/index";
import TopCon from "../uiComponent/TopCon";
import { callActiveagents, callActiverooms, callAgents, callagents, callcompletedchats, calltemplatesbymanager, getescalation } from '../../Services/Api';

const ManagerDb = ({
  setIsLogedin,
  userData,
  noOfRequestedChats,
  socket
}) => {
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
    const allAgents= await callAgents();

      const allAgentsOfThisManager = allAgents.filter((agent) => {
        return agent.creatorUID === userData.user_id
      });
      setTotalNoOfAgents(allAgentsOfThisManager.length);
  }

  //function for getting all the active agents
  const getActiveAgents = async () => {
    const active_agents=await callActiveagents();
    const allActiveAgentsOfThisManager = active_agents.filter((agent) => {
      return agent.creatorUID === userData.user_id
    })

    setTotalNoOfActiveAgents(allActiveAgentsOfThisManager.length);
  }

  //function for getting all the active rooms
  const getRooms = async () => {
    const rooms=await callActiverooms();
     //removing rooms which are not for this perticular manager
     for(let i=0; i < rooms.length; i++){
      if(rooms[i].managerID !== userData.user_id){
        rooms.splice(i, 1);
      }
    }
    setTotalNoOfOpenChats(rooms.length);
  }

  //function for getting all the escalations of this perticular manager
  const getEscalations = async () => {
    const escalations=await getescalation(userData.user_id)
    setTotalEscalations(escalations);
    setTotalNoOfEscalations(escalations.length);
  }

  //function for getting all the templates from the database
  const getTemplates = async() => {
    const templates=await calltemplatesbymanager(userData.user_id);
    setTotalTemplates(templates);
    setTotalNoOfTemplates(templates.length);
  }

  //function for getting all the completed chats from the database
  const getCompletedChats = async () => {
    const chats=await callcompletedchats();
    setTotalCompletedChats(chats);
    setTotalNoOfCompletedChats(chats.length);
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
      <div className="rootCon" id='rootCon'>
        <Sidebar role="Manager"  setIsLogedin={setIsLogedin} page="overview" noOfRequestedChats={noOfRequestedChats}/>
        <div className="dataCon" id='dataCon'>
          <TopCon userName={userData.name} page="Overview"/>

          <div className="dashBoard" id='dashBoard'>

            <div className="firstCon" id='firstCon'>

              <div className="upCon" id='upCon'>

              <div className="upConFirstCon" id='upConFirstCon'>
                <a href="/agents">
                  <div className="divInA"id='divInA'>
                    <p className="upConHeading" id='upConHeading'>Agents</p>
                    <span>{totalNoOfAgents}</span>
                  </div>
                </a>

                <a href="/asign_agent">
                  <div className="divInA" id='divInA'>
                    <p className="upConHeading" id='upConHeading'>Active Agents</p>
                    <span>{totalNoOfActiveAgents}</span>
                  </div>
                </a>


                <a href="/asign_agent">
                  <div className="divInA" id='divInA'>
                    <p className="upConHeading" id='upConHeading'>Unresponded Chats</p>
                    <span>{totalNoOfOpenChats}</span>
                  </div>
                </a>
              </div>



                <p className="filterSelect" id='filterSelect'>
                    <select onChange={(e) => {
                      filterData(e.target.value)
                    }}>
                      <option value="all">All Time</option>
                      <option value="7">Past 7 Days</option>
                      <option value="30">Past 30 Days</option>
                    </select>
                </p>

                <div className="upConFirstCon" id='upConFirstCon'>
                  <a href="/chat_requests">
                    <div className="divInA" id='divInA'>
                      <p className="upConHeading" id='upConHeading'>Escalated Chats</p>
                      <span>{totalNoOfEscalations}</span>
                    </div>
                  </a>

                  <a href="/new_template_request">
                    <div className="divInA" id='divInA'>
                      <p className="upConHeading" id='upConHeading'>Template Created</p>
                      <span>{totalNoOfTemplates}</span>
                    </div>
                  </a>

                  <a href="/">
                    <div className="divInA" id='divInA'>
                      <p className="upConHeading" id='upConHeading'>Completed Chats</p>
                      <span>{totalNoOfCompletedChats}</span>
                    </div>
                  </a>
                </div>



              </div>

              <div className="chartsCon" id='chartsCon'>
                <div className="doughnutChart " id='doughnutChart'>
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

                <div className="managerLineChart" id='managerLineChart'>
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
