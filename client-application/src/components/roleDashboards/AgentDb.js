import React, {useState, useEffect} from 'react';


//importing charts
import AgentDNChart from "../charts/AgentDNChart";
import AdminBar from "../charts/AdminBar";
import AdminLine from "../charts/AdminLine";

//importing UI Components
import Sidebar from "../uiComponent/sidebar/index";
import TopCon from "../uiComponent/TopCon";
import { callActiverooms, callAssignedChats, callcompletedchats } from '../../Services/Api';

const AgentDb = ({setIsLogedin, userData, socket}) => {

      //defining state variables
      const [totalNoOfOpenChats, setTotalNoOfOpenChats] = useState(0);
      const [totalNoOfCompletedChats, setTotalNoOfCompletedChats] = useState(0);
      const [noOfAssignedChats, setNoOfAssignedChats] = useState(0);
      const [totalNoOfCustomerHandled, setTotalNoOfCustomerHandled] = useState(0);

      const [totalCompletedChats, setTotalCompletedChats] = useState([]);
      const [totalCustomerHandled, setTotalCustomerHandled] = useState([]);

      const [showBar, setShowBar] = useState(true);

      //Getting all active rooms exist currently
      const getRooms = async () => {
          const rooms=await callActiverooms();
          for(let i=0; i < rooms.length; i++){
            if(rooms[i].managerID !== userData.creatorUID){
              rooms.splice(i, 1);
            }
          }
          setTotalNoOfOpenChats(rooms.length);
      }

      //function for getting all the completed chats from the database
      const getCompletedChats = async () => {
        const chats=await callcompletedchats();
        const chatsByThisAgent = chats.filter((chat) => {
          return chat.agentName === userData.name
        })
        getNoOfUniqueConstomerhandled(chatsByThisAgent);
        setTotalCompletedChats(chatsByThisAgent);
        setTotalNoOfCompletedChats(chatsByThisAgent.length);
      }

      //Getting all assigned rooms to this agent
      const getAssignedChats = async () => {
        const assignList=await callAssignedChats();
            //filtering out the vhats which are not assigned to this perticular agent
            const assignedChats = assignList.filter((assined) => {
              return assined.agentEmail === userData.email
            });

            setNoOfAssignedChats(assignedChats.length);
      }

      //For getting the number of unique customers handled by this perticular agent
      const getNoOfUniqueConstomerhandled = async (chatList) => {

        //filtering out duplicate chats
        chatList = chatList.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.userPhoneNo === value.userPhoneNo
          ))
        )
        setTotalCustomerHandled(chatList)
        setTotalNoOfCustomerHandled(chatList.length);
      }

      //filtering data based on time
      const filterData = (selectedFilter) => {

        const currentDate = new Date().getTime();

        let noOfCompletedChats = 0, noOfCustomerHandled = 0;

        if(selectedFilter === "all"){


          noOfCompletedChats = totalCompletedChats.length;
          noOfCustomerHandled = totalCustomerHandled.length;

        }else{
          let comparedDate;

          if(selectedFilter === 7){
            comparedDate = currentDate - 7*24*60*60*1000;
          }else if(selectedFilter === 30){
            comparedDate = currentDate - 30*24*60*60*1000;
          }

          for(let chat of totalCompletedChats){
            if(chat.lastInteraction >= comparedDate){
              noOfCompletedChats++
            }
          }
          for(let chat of totalCustomerHandled){
            if(chat.lastInteraction >= comparedDate){
              noOfCustomerHandled++
            }
          }
        }

        setTotalNoOfCustomerHandled(noOfCustomerHandled);
        setTotalNoOfCompletedChats(noOfCompletedChats);
      }

      useEffect(() => {
        getRooms();
        getCompletedChats();
        getAssignedChats();
      }, []);

      useEffect(() => {
        //updating data on broadcast
        socket.on("broadcast", (data) => {
          getRooms();
          getCompletedChats();
          getAssignedChats();
        });
      }, [socket])

      return (
          <div className="rootCon">
            <Sidebar role={process.env.REACT_APP_AgentRole} setIsLogedin={setIsLogedin} page="overview" />
            <div className="dataCon">
              <TopCon userName={userData.name} page="Overview"/>

              <div className="dashBoard">

                <div className="firstCon">

                  <div className="upCon agentUpCon">

                  <div className="upConFirstCon">
                    <a href="/chat">
                      <div className="divInA">
                        Pending Chats <span>{totalNoOfOpenChats}</span>
                      </div>
                    </a>

                    <a href="/chat">
                      <div className="divInA">
                         Assigned Chats <span>{noOfAssignedChats}</span>
                      </div>
                    </a>
                  </div>


                    <p className="filterSelect agentSelect">
                        <select onChange={(e) => {
                          filterData(e.target.value)
                        }}>
                          <option value="all">All Time</option>
                          <option value="7">Past 7 Days</option>
                          <option value="30">Past 30 Days</option>
                        </select>
                    </p>

                    <div className="upConFirstCon">
                      <a href="/">
                        <div className="divInA">
                           Completed Chats <span>{totalNoOfCompletedChats}</span>
                        </div>
                      </a>

                      <a href="/">
                        <div className="divInA">
                          Contacts handled <span>{totalNoOfCustomerHandled}</span>
                        </div>
                      </a>
                    </div>

                  </div>


                <div className="chartsCon">
                  <div className="doughnutChart">
                    <AgentDNChart exData = {{
                      penChats: totalNoOfOpenChats,
                      assChats: noOfAssignedChats,
                      comChats: totalNoOfCompletedChats,
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
                      <AdminBar totalCompletedChats={totalCompletedChats}/>
                    ): (
                      <AdminLine totalCompletedChats={totalCompletedChats}/>
                    )}
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
      )
}

export default AgentDb;
