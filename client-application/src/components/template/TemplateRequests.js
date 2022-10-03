import React, {useState, useEffect} from 'react'

import Sidebar from "../uiComponent/sidebar/index";
import TopCon from "../uiComponent/TopCon";
import { callgetalltemplates, updateTempStatus } from '../../Services/Api';

const TemplateRequests = ({setIsLogedin, userName, noOfPendingTemplates, setNoOfPendingTemplates}) => {

      //defining state variables
      const [allTemplates, setAllTemplates] = useState([]);

      //function for getting all the templates from the database
      const getTemplates = async () => {
        const alltemplates=await callgetalltemplates();
        const pendingChats =alltemplates.filter((template) => {
          return template.status === "Pending"
        })
        setNoOfPendingTemplates(pendingChats.length);
        setAllTemplates(alltemplates);
      }

      //function for updating the status of the template
      const updateStatus = async (tempID, status) => {
        await updateTempStatus(tempID,status);
        getTemplates();
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
            <Sidebar role={process.env.REACT_APP_AdminRole} setIsLogedin={setIsLogedin} page="templateRequests" noOfPendingTemplates={noOfPendingTemplates} />

            <div className="dataCon" style={{width:"85.4%"}}>
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
