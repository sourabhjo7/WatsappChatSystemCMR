import React, {useState, useEffect} from 'react'
import axios from "axios";

import "./AllFlows.css"

import Sidebar from "./uiComponent/Sidebar";
import TopCon from "./uiComponent/TopCon";
import DndAllFlowsMap from './uiComponent/DndAllFlowsMap';



function AllFlows({baseBulkMessagingURL, baseUserSystemURL, setIsLogedin, userName, userId, noOfRequestedChats}) {
  const initialNodes = [
    {
      id: '1',
      type: 'input',
      data: { label: 'Input Node' },
      position: { x: 250, y: 25 },
    },
  
    {
      id: '2',
      // you can also pass a React component as a label
      data: { label: <div>Default Node</div> },
      position: { x: 100, y: 125 },
    },
    {
      id: '3',
      type: 'output',
      data: { label: 'Output Node' },
      position: { x: 250, y: 250 },
    },
  ];
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3', animated: true },
  ];
    const [flows, setFlows] = useState([]);
    const [selectedFlow, setSelectedFlow] = useState({});
    const [nodes,setNodes]=useState([]);
    const [edges,setEdges]=useState([]);
    
    const getFlows = async () => {

      await axios.post(`${baseBulkMessagingURL}/getflows`, {managerId: userId}, { validateStatus: false, withCredentials: true }).then((response) => {
        //setting the templates with the response from the API
        console.log(response.data.flows);
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
    const SelectedFlowCon = () => {
      return (
        <div className="flow_main_conatiner_mid_con">
          <div className="flow_mid_child_container contact">
            {selectedFlow.contactList.map((contact, index) => {
              return <p key={"contact" + index}>{contact}</p>
            })}
          </div>
          <div className="flow_mid_child_container message">
              <DndAllFlowsMap nodes={selectedFlow.defaultData.nodes}  edges={selectedFlow.defaultData.edges} />
          </div>
        </div>
      )
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
                return <p key={"flow" + index} onClick={chnageSelectedFlow} style={flow.title === selectedFlow.title ? {background: '#97A4FC', color: '#fff'} : {background: '#CDF6E5'}}>{flow.title}</p>
              })}
            </div>

            <div className="flow_main_conatiner">
              <h4 className="flow_main_conatiner_top_con">{selectedFlow.title}</h4>
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
