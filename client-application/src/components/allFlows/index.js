import React, {useState, useEffect} from 'react'

import "./index.scss"

import Sidebar from "../uiComponent/sidebar/index";
import TopCon from "../uiComponent/TopCon";
import DndAllFlowsMap from './DndAllFlowsMap';
import { callgetflows } from '../../Services/Api';


const AllFlows = ({setIsLogedin, userName, userId, noOfRequestedChats}) => {

    const [flows, setFlows] = useState([]);
    const [selectedFlow, setSelectedFlow] = useState({});

    const getFlows = async () => {
      const data=await callgetflows(userId);
      console.log("test--->",data);
      if(data.length > 0){
        setFlows(data);
        setSelectedFlow(data[0]);
      }

    }

    const chnageSelectedFlow = async (e) => {
      for(let flow of flows){
        if(flow.title === e.target.innerHTML){
         setSelectedFlow(flow);
        }
      }
    }
    const SelectedFlowCon = () => {
      return (
        <div className="flow_main_conatiner_mid_con" id='flow_main_conatiner_mid_con'>
          <div className="flow_mid_child_container contact" id='flow_mid_child_container_contact'>
            {selectedFlow.contactList.map((contact, index) => {
              return <p key={"contact" + index}>{contact}</p>
            })}
          </div>
          <div className="flow_mid_child_container message" id='flow_mid_child_container_message'>
              <DndAllFlowsMap nodes={selectedFlow.defaultData.nodes}  edges={selectedFlow.defaultData.edges} />
          </div>
        </div>
      )
    }

    useEffect(() => {
      getFlows()
    }, [])

    return (
      <div className="rootCon" id='rootCon'>
        <Sidebar role={process.env.REACT_APP_ManagerRole} setIsLogedin={setIsLogedin} page="AllFlows" noOfRequestedChats={noOfRequestedChats}/>

        <div className="dataCon" id='dataCon'>
          <TopCon userName={userName} page="All Flows"/>

          <div className="main_container" id='main_container'>

            <div className="flow_populate_container" id='flow_populate_container'>
              {flows.map((flow, index) => {
                return <p key={"flow" + index} onClick={chnageSelectedFlow} style={flow.title === selectedFlow.title ? {background: '#97A4FC', color: '#fff'} : {background: '#CDFCE5'}}>{flow.title}</p>
              })}
            </div>

            <div className="flow_main_conatiner" id='flow_main_conatiner'>
              <h4 className="flow_main_conatiner_top_con" id='flow_main_conatiner_top_con'>{selectedFlow.title}</h4>
              {JSON.stringify(selectedFlow) !== '{}' ? (
                <SelectedFlowCon/>
              ) : (
                <></>
              )}

            </div>

          </div>

        </div>
      </div>
    )
}

export default AllFlows;
