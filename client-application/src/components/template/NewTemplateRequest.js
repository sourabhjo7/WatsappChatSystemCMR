import React, {useState, useEffect} from 'react'

import Sidebar from "../uiComponent/sidebar/index";
import TopCon from "../uiComponent/TopCon";

import AddNewTemp from "./AddNewTemp";
import { calltemplatesbymanager } from '../../Services/Api';

const NewTemplateRequest = ({userName, userID, setIsLogedin, noOfRequestedChats}) => {

      //defining state variables
      const [showAddCom, setShowAddComp] = useState(false);

      const [allTemplates, setAllTemplates] = useState([]);

      //function for getting all the templates from the database
      const getTemplates = async () => {
        const templates=await calltemplatesbymanager(userID);
        console.log(templates);
        setAllTemplates(templates);
      }
      useEffect(() => {
        getTemplates();
      }, [])

      return (
          <div className="rootCon">
            <Sidebar role={process.env.REACT_APP_ManagerRole} setIsLogedin={setIsLogedin} page="newTemplateRequest" noOfRequestedChats={noOfRequestedChats}/>

            <div className="dataCon">
              <TopCon userName={userName} page="Your Templates"/>

              <div>
                <button className="joinbtn" onClick={(e) => {
                  setShowAddComp((curr) => {
                    if(!curr){
                      e.target.innerHTML = "&#9587;";
                    }else{
                      e.target.innerText = "Add More";
                    }
                    return !curr
                  });
                }}>Add More</button>

                {showAddCom ? (
                  <AddNewTemp userName={userName} userID={userID}/>
                ) : (
                  <></>
                )}

                <div className="allTempCon">

                  <div className="populateTempCon headCon">

                    <div className="tempConDet tempHeadCon">
                      <p>Title</p>
                      <p>Format</p>
                      <p>Sample</p>
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
                          <span className={temp.status}></span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
      )
}

export default NewTemplateRequest;
