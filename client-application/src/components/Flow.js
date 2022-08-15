import React, {useState, useEffect} from 'react'
import axios from "axios";


import Sidebar from "./uiComponent/Sidebar";
import TopCon from "./uiComponent/TopCon";



function Flow({baseBulkMessagingURL, baseUserSystemURL, setIsLogedin, userName, userId, noOfRequestedChats}) {
        const [inputTime,setinputTime]=useState(0);
        const [time_delay,setTime_delay]=useState(0);
        const [format,setformat]=useState("min");
        let dummyData={
            "msg_array" : ["hi","hello"],
            "contact_list":[9549408165,7845321246],
            "triggers":{
                "hi":2
            },
            "time_delay":time_delay
            
         };
          

        const  getAcutalTime = ()=>
            {
                if(format==="min"){
                    setTime_delay(inputTime*60*1000); 
                } 
                else if(format==="sec")
                {
                     setTime_delay(inputTime*1000);
                 }  
            }
            useEffect(() => {
              getAcutalTime();

            }, [format,inputTime]);
            
           const  handleSubmit =async (e)=>{
            const {data}=await axios.post(`${baseBulkMessagingURL}/createnewflow`,dummyData,{ validateStatus: false, withCredentials: true });
        console.log(data.data);   
        }
    return (
        <div className="rootCon">
          <Sidebar role="Manager" baseURL={baseUserSystemURL} setIsLogedin={setIsLogedin} page="flow" noOfRequestedChats={noOfRequestedChats}/>

          <div className="dataCon">
            <TopCon userName={userName} page="Flow"/>
            
            <input type="number" value={inputTime} onChange={(ele)=>{
                setinputTime(ele.target.value);
                }} />
            <div>

          <label for="format">Format</label>
          <select value={format}
          onChange ={(e)=>{setformat(e.target.value)}}
          
          name="format" id="format">
           <option value="min">minutes</option>
           <option value="sec"> seconds</option>
           </select>
           <h1>{time_delay}</h1>
           <input type="submit" onClick={handleSubmit}/>
            </div>
           

          </div>
        </div>
    )
}

export default Flow;
