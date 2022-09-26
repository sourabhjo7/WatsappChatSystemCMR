import React, { useState, useEffect } from "react";

//importing charts
import BarChart from "../charts/BarChart";
import AdminBar from "../charts/AdminBar";
import AdminLine from "../charts/AdminLine";

//importing UI Components
import Sidebar from "../uiComponent/sidebar/index";
import TopCon from "../uiComponent/TopCon";
import {
  callAgents,
  callcompletedchats,
  callgetalltemplates,
  callmanagers,
} from "../../Services/Api";

const AdminDb = ({ setIsLogedin, userData, noOfPendingTemplates }) => {
  //defining state variables
  const [totalNoOfAgents, setTotalNoOfAgents] = useState(0);
  const [totalNoOfManagers, setTotalNoOfManagers] = useState(0);
  const [totalNoOfTemplates, setTotalNoOfTemplates] = useState(0);

  const [totalNoOfCompletedChats, setTotalNoOfCompletedChats] = useState(0);

  const [totalCompletedChats, setTotalCompletedChats] = useState([]);

  const [showBar, setShowBar] = useState(true);

  //function for getting all the agents from the database
  const getAgents = async () => {
    const allagents = await callAgents();
    setTotalNoOfAgents(allagents.length);
  };

  //function for getting all the managers from the database
  const getManagers = async () => {
    const allmanagers = await callmanagers();
    setTotalNoOfManagers(allmanagers.length);
  };

  //function for getting all the templates from the database
  const getTemplates = async () => {
    const allTemplates = await callgetalltemplates();
    setTotalNoOfTemplates(allTemplates.length);
  };

  //function for getting all the completed chats from the database
  const getCompletedChats = async () => {
    const chats = await callcompletedchats();
    setTotalCompletedChats(chats);
    setTotalNoOfCompletedChats(chats.length);
  };

  //filtering data based on time
  const filterData = (selectedFilter) => {
    const currentDate = new Date().getTime();

    let noOfCompletedChats = 0;

    if (selectedFilter === "all") {
      noOfCompletedChats = totalCompletedChats.length;
    } else {
      let comparedDate;

      if (selectedFilter === 7) {
        comparedDate = currentDate - 7 * 24 * 60 * 60 * 1000;
      } else if (selectedFilter === 30) {
        comparedDate = currentDate - 30 * 24 * 60 * 60 * 1000;
      }

      for (let chat of totalCompletedChats) {
        if (chat.lastInteraction >= comparedDate) {
          noOfCompletedChats++;
        }
      }
    }

    setTotalNoOfCompletedChats(noOfCompletedChats);
  };

  useEffect(() => {
    getAgents();
    getManagers();
    getCompletedChats();
    getTemplates();
  }, []);

  return (
    <div className="rootCon " id="rootCon">
      <Sidebar
        role={process.env.REACT_APP_AdminRole}
        setIsLogedin={setIsLogedin}
        page="overview"
        noOfPendingTemplates={noOfPendingTemplates}
      />
      <div className="dataCon" id="dataCon">
        <TopCon userName={userData.name} page="Overview" />

        <div className="dashBoard" id="dashBoard">
          <div className="firstCon" id="firstCon">
            <div className="upCon" id="upCon">
              <div className="upConFirstConadmin" id="upConFirstCon">
                <a href="/managers">
                  <div className="divInA" id="divInA">
                    Managers <span>{totalNoOfManagers}</span>
                  </div>
                </a>

                <a href="/">
                  <div className="divInA" id="divInA">
                    Agents <span>{totalNoOfAgents}</span>
                  </div>
                </a>

                <a href="/template_requests">
                  <div className="divInA" id="divInA">
                    Templates <span>{totalNoOfTemplates}</span>
                  </div>
                </a>
              </div>
                <div className="upConFirstConadmin">
              <p className="filterSelect" id="filterSelect">
                <select style={{marginLeft:"202%"}}
                  onChange={(e) => {
                    filterData(e.target.value);
                  }}
                >
                  <option value="all">All Time</option>
                  <option value="7">Past 7 Days</option>
                  <option value="30">Past 30 Days</option>
                </select>

                <a href="/managers" style={{marginLeft:"10%"}} >
                  <div className="divInA" id="divInA">
                    Completed Chats <span>{totalNoOfCompletedChats}</span>
                  </div>
                </a>
              </p>
              </div>
            </div>
          </div>

          <div className="chartsCon" id="chartsCon">
            <div className="bar_lineChartsAdmin">
              <div className="managerLineChart" id="managerLineChart">
              <div className="filterSelectCharts" id='filterSelectCharts'>
              <select
                onChange={(e) => {
                  console.log(e.target.value);
                  if (e.target.value === "bar") {
                    setShowBar(true);
                  } else {
                    setShowBar(false);
                  }
                }}
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
              </select>
                    </div>
                {showBar ? (
                  <AdminBar totalCompletedChats={totalCompletedChats} />
                ) : (
                  <AdminLine totalCompletedChats={totalCompletedChats} />
                )}
              </div>
              <div className="barChart" id="barChart">
                <BarChart
                  exData={{
                    manager: totalNoOfManagers,
                    agent: totalNoOfAgents,
                    template: totalNoOfTemplates,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDb;
