import React, {useState, useEffect} from 'react'
import axios from "axios";

import "./AllFlows.css"

import Sidebar from "./uiComponent/Sidebar";
import TopCon from "./uiComponent/TopCon";

function AllFlows({baseBulkMessagingURL, baseUserSystemURL, setIsLogedin, userName, userId, noOfRequestedChats}) {

    const [flows, setFlows] = useState([]);
    const [selectedFlow, setSelectedFlow] = useState({});

    const getFlows = async () => {

      await axios.post(`${baseBulkMessagingURL}/getflows`, {managerId: userId}, { validateStatus: false, withCredentials: true }).then((response) => {
        //setting the templates with the response from the API
        if(response.data.flows.length > 0){
          setFlows(response.data.flows);
          setSelectedFlow(response.data.flows[0]);
        }
      });

    }

    const chnageSelectedFlow = async (e) => {
      for(let flow of flows){
        if(flow.title === e.target.innerHTML){
          setSelectedFlow(flow);
        }
      }
    }

    useEffect(() => {
      getFlows()
    }, [])

    return (
      <div className="rootCon">
        <Sidebar role="Manager" baseURL={baseUserSystemURL} setIsLogedin={setIsLogedin} page="AllFlows" noOfRequestedChats={noOfRequestedChats}/>

        <div className="dataCon">
          <TopCon userName={userName} page="All Flows"/>

          <div className="main_container">

            <div className="flow_populate_container">
              {flows.map((flow, index) => {
                return <p onClick={chnageSelectedFlow} style={flow.title === selectedFlow.title ? {background: '#97A4FC', color: '#fff'} : {background: '#CDF6E5'}}>{flow.title}</p>
              })}
            </div>

            <div className="flow_main_conatiner">
              <h4 className="flow_main_conatiner_top_con">{selectedFlow.title}</h4>
              
            </div>

          </div>

        </div>
      </div>
    )
}

export default AllFlows;
