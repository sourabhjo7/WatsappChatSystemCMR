import axios from "axios";

 export const calltoken= async(baseUserSystemURL)=>{
  return await axios.get(baseUserSystemURL, { validateStatus: false, withCredentials: true }).then((response) => {
    if(response.status === 404 || response.status === 401){
      return false;
    }else{
      return response.data.user;
    }
  });

 }

 export const callAssignedChats= async(baseChatSystemURL)=>{
  return await axios.get(`${baseChatSystemURL}/assigned`, { validateStatus: false, withCredentials: true }).then((response) => {
    return response.data.assignList;
    });
  };

  export const callNoPendingChats =async (baseChatSystemURL)=>{
    return await axios.get(`${baseChatSystemURL}/noOfPendingTemplates `, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.noOfPendingTemplates;
    });
  }

  export const callgetflows =async(baseBulkMessagingURL,userId)=>{
    return await axios.post(`${baseBulkMessagingURL}/getflows`, {managerId: userId}, { validateStatus: false, withCredentials: true }).then((response) => {
      //setting the templates with the response from the API
      return response.data.flows;
    });
  }

  export const callapprovedtemplates=async (baseBulkMessagingURL,userId)=>{
    return  await axios.post(`${baseBulkMessagingURL}/aprovedTemplates`, {userId}, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.templates;
    });
  }

  export const calloptedinUsers = async (baseBulkMessagingURL,userId)=>{
    return await axios.post(`${baseBulkMessagingURL}/optedinUsers`, {userId}, { validateStatus: false, withCredentials: true }).then((response) => {
      //setting the optedinUsers with the response from the API
      return response.data.users;
    });

  }

  export const callstoredCustomers =async (baseBulkMessagingURL)=>{

    return await axios.get(`${baseBulkMessagingURL}/storedCustomers`, { validateStatus: false, withCredentials: true }).then((response) => {
      //getting the stored users from the response from the API
return response.data.users;
    });
  }

  export const callbroadcastMessage =async (baseBulkMessagingURL,message,toBeBroadcastNo,userId)=>{
    return await axios.post(`${baseBulkMessagingURL}/broadcastMessage`, {message, toBeBroadcastNo, userId}, {validateStatus: false, withCredentials: true}).then((response) => {
      return response.data;

    });
  }

  export const callcreate_new_campaign =async(baseBulkMessagingURL,data)=>{
    return await  axios.post(`${baseBulkMessagingURL}/create_new_campaign`, data, {
      validateStatus: false,
      withCredentials: true
    });

  }

  export const callcreate_new_flow =async(baseBulkMessagingURL,data)=>{
    return await  axios.post(`${baseBulkMessagingURL}/create_new_flow`, data, {
      validateStatus: false,
      withCredentials: true
    });

  }
  export const callActiveagents= async (baseChatSystemURL)=>{
    return await axios.get(`${baseChatSystemURL}/active_agents`, { validateStatus: false, withCredentials: true }).then(async (response) => {
      return response.data.activeAgents;
    });
  }
  export const callActiverooms= async (baseChatSystemURL)=>{
    return await axios.get(`${baseChatSystemURL}/active_rooms`, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.chats;
    });
  }

  export const newescalation =async(baseUserSystemURL,room,phoneNo,name,managerID)=>{
    await axios.post(`${baseUserSystemURL}/new_escalation`, {room, customerPhoneNo: phoneNo, escalatedBy: name, managerID}, { validateStatus: false, withCredentials: true }).then((response) => {
      console.log(response.data);
    });
  }
  export const getescalation =async(baseUserSystemURL,managerID)=>{
    return await axios.post(`${baseUserSystemURL}/get_escalations`,  {managerID:managerID}, { validateStatus: false, withCredentials: true }).then((response) => {
          console.log(response.data);
      return response.data.escalations;
    });
  }
  export const callLogin=async(baseURL,email,password)=>{
    return await axios.post(`${baseURL}/auth/login`, {email, password}, {validateStatus: false, withCredentials: true}).then((response) => {
      if(response.status === 200 && response.data.success){
        console.log("User Logedin");
        return response.data.user;
      }else{
        console.log("Login Failed");
        return false;
      }
    });
  }


  export const callindiuser=async(baseURL,id)=>{
    return await axios.post(`${baseURL}/indi_user`, {userId: id}, { validateStatus: false, withCredentials: true }).then((response) => {
      console.log("indiuser:==:", response.data.foundUser);
      return response.data.foundUser;

    });
  }

  export const callagents= async (baseChatSystemURL)=>{
    return await axios.get(`${baseChatSystemURL}/active_agents`, { validateStatus: false, withCredentials: true }).then(async (response) => {
     console.log("called active agents",response.data.activeAgents);
      return response.data.activeAgents;
    });
  }
  
  export const callcompletedchats=async(baseChatSystemURL,id)=>{
    return await axios.post(`${baseChatSystemURL}/completedChats`, {managerID: id},{ validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.chats;
    });
  }

  export const calltemplatesbymanager=async(baseChatSystemURL,id)=>{
    return await axios.post(`${baseChatSystemURL}/allTemplatesByManager`, {managerID: id},{ validateStatus: false, withCredentials: true }).then((response) => {
      console.log(response.data);
      return response.data.templates;
    });
  }

  export const callAgents=async(baseUserSystemURL)=>{
    return await axios.get(`${baseUserSystemURL}/agents`, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.agents;
    });
  }
  export const callmanagers=async(baseUserSystemURL)=>{
    return await axios.get(`${baseUserSystemURL}/managers`, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.managers;
    });
  }
  
  export const callgetalltemplates=async(baseBulkMessagingURL)=>{
    return await axios.get(`${baseBulkMessagingURL}/get_all_templates`, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.allTemplates;
    });
  }

  export const AddNewTempplate=async(baseURL,newTemplate)=>{
    await axios.post(`${baseURL}/add_new_template`, newTemplate, {validateStatus: false, withCredentials: true}).then((response) => {
      // console.log(response.data);
      window.location = "/";
    });
  }

  export const updateTempStatus=async(baseBulkMessagingURL,tempID,status)=>{
    await axios.post(`${baseBulkMessagingURL}/updateTempStatus`, {tempID, status},{validateStatus: false, withCredentials: true}).then((response) => {
      console.log(response.data);
    });
  }

export const callgetUsers=async(baseURL,getRole)=>{
  return await axios.get(`${baseURL}/${getRole}`, { validateStatus: false, withCredentials: true }).then((response) => {
    return response.data[`${getRole}`];
  });
}



export const calldelUser=async(url,userID)=>{
 await axios.post(url, {userID} , { validateStatus: false, withCredentials: true }).then((response) => {
    console.log(response);
  });
}

export const callregNewUser=async(baseURL,newUserData)=>{
  await axios.post(`${baseURL}/auth/register`, newUserData, {validateStatus: false, withCredentials: true}).then((response) => {
    if(response.status === 201){
      window.location = '/';
    }else{
      console.log("Registration Failed");
    }
  });
}

export const callassignAgent=async(baseChatSystemURL,room, agent,  userName)=>{
  await axios.post(`${baseChatSystemURL}/assign_agent`, {room:room, agentEmail: agent.email, assignedBy: userName}, {validateStatus: false, withCredentials: true}).then((response) => {
    if(response.status === 200){
      console.log("Assignment Done");

    }else{
      console.log("Failed");
    }
  });
}


export const callchangeName=async(baseURL,newDel)=>{
  return await axios.post(`${baseURL}/change_name`, newDel, {validateStatus: false, withCredentials: true}).then((response) => {
   return response;
  });
}

export const callchangePassword=async(baseURL,newPassword)=>{
  axios.post(`${baseURL}/change_password`, newPassword, {validateStatus: false, withCredentials: true}).then((response) => {
    if(response.status === 200){
      // console.log(response.data);
      window.location = "/";
    }
  });
}
export const calllogout=async(baseURL)=>{
  return await axios.get(`${baseURL}/auth/logout`, { validateStatus: false, withCredentials: true }).then((response) => {
     return response
    });
}