import React, {useState, useEffect} from 'react'
import axios from "axios";

import Sidebar from "./uiComponent/Sidebar";
import TopCon from "./uiComponent/TopCon";

function TemplateRequests({baseBulkMessagingURL, baseUserSystemURL, setIsLogedin, userName, noOfPendingTemplates, setNoOfPendingTemplates}) {

    //defining state variables
    const [allTemplates, setAllTemplates] = useState([]);

    //function for getting all the templates from the database
    const getTemplates = async () => {
      axios.get(`${baseBulkMessagingURL}/get_all_templates`, {validateStatus: false, withCredentials: true}).then((response) => {

        const pendingChats = response.data.allTemplates.filter((template) => {
          return template.status === "Pending"
        })
        setNoOfPendingTemplates(pendingChats.length);
        setAllTemplates(response.data.allTemplates);
      });
    }

    //function for updating the status of the template
    const updateStatus = async (tempID, status) => {
      axios.post(`${baseBulkMessagingURL}/updateTempStatus`, {tempID, status},{validateStatus: false, withCredentials: true}).then((response) => {
        getTemplates();
        console.log(response.data);
      });
    }

    //Status Button component
    const StatusBtn = ({temp}) => {
      if(temp.status === "Pending"){
        return (
          <button className="joinbtn statusBtn" onClick={() => {
            updateStatus(temp._id, "Submitted");
          }}>Submitted</button>
        )
      }else if(temp.status === "Submitted"){
        return (
          <button className="joinbtn statusBtn" onClick={() => {
            updateStatus(temp._id, "Approved");
          }}>Approved</button>
        )
      }else{
        return (<></>);
      }
    }

    useEffect(() => {
      getTemplates();
    }, [])

    return (
        <div className="rootCon">
          <Sidebar role="Admin" baseURL={baseUserSystemURL} setIsLogedin={setIsLogedin} page="templateRequests" noOfPendingTemplates={noOfPendingTemplates} />

          <div className="dataCon">
            <TopCon userName={userName} page="Template Requests"/>

            <div className="allTempCon">

              <div className="populateTempCon headCon">

                <div className="tempConDet tempHeadCon">
                  <p>Title</p>
                  <p>Format</p>
                  <p>Sample</p>
                  <p>Requested By</p>
                  <span></span>
                </div>
              </div>

              {allTemplates.map((temp, index) => {
                return (
                  <div className="populateTempCon" key={index}>

                    <div className="tempConDet">
                      <p>{temp.name}</p>
                      <p>{temp.format}</p>
                      <p>{temp.sample}</p>
                      <p>{temp.requestByName}</p>
                      <span className={temp.status}></span>
                    </div>
                    <div className="staBtnCon">
                      <StatusBtn temp={temp} />
                    </div>
                  </div>

                )
              })}
            </div>

          </div>
        </div>
    )
}

export default TemplateRequests;
