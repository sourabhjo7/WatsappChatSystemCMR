import React, {useState, useEffect} from 'react'
import axios from "axios";

import Sidebar from "./uiComponent/Sidebar";
import TopCon from "./uiComponent/TopCon";

function AllFlows({baseBulkMessagingURL, baseUserSystemURL, setIsLogedin, userName, userId, noOfRequestedChats}) {

    const [flows, setFlows] = useState([]);

    const getFlows = async () => {

      await axios.post(`${baseBulkMessagingURL}/getflows`, {managerId: userId}, { validateStatus: false, withCredentials: true }).then((response) => {
        //setting the templates with the response from the API
        console.log(response.data.flows);
        setFlows(response.data.flows);
      });

    }

    useEffect(() => {
      getFlows()
    }, [])

    return (
      <div className="rootCon">
        <Sidebar role="Manager" baseURL={baseUserSystemURL} setIsLogedin={setIsLogedin} page="AllFlows" noOfRequestedChats={noOfRequestedChats}/>

        <div className="dataCon">
          <TopCon userName={userName} page="All Flows"/>

          {flows.map((flow, index) => {
            return <div>
              <p>{flow.title}</p>
              <p>{flow.tMessages}</p>
            </div>
          })}

        </div>
      </div>
    )
}

export default AllFlows;
