import axios from "axios";

const baseUserSystemURL = process.env.REACT_APP_baseUserSystemURL;
const baseChatSystemURL = process.env.REACT_APP_baseChatSystemURL;
const baseBulkMessagingURL = process.env.REACT_APP_baseBulkMessagingURL;

 export const calltoken= async()=>{
  return await axios.get(baseUserSystemURL, { validateStatus: false, withCredentials: true }).then((response) => {
    if(response.status === 404 || response.status === 401){
      return false;
    }else{
      return response.data.user;
    }
  });

 }

 export const callAssignedChats= async()=>{
  return await axios.get(`${baseChatSystemURL}/assigned`, { validateStatus: false, withCredentials: true }).then((response) => {
    return response.data.assignList;
    });
  };

  export const callNoPendingTemplates =async ()=>{
    return await axios.get(`${baseChatSystemURL}/noOfPendingTemplates `, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.noOfPendingTemplates;
    });
  }

  export const callgetflows =async(userId)=>{
    return await axios.post(`${baseBulkMessagingURL}/getflows`, {managerId: userId}, { validateStatus: false, withCredentials: true }).then((response) => {
      //setting the templates with the response from the API
      return response.data.flows;
    });
  }

  export const callapprovedtemplates=async (userId)=>{
    return  await axios.post(`${baseBulkMessagingURL}/aprovedTemplates`, {userId}, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.templates;
    });
  }

  export const calloptedinUsers = async (userId)=>{
    return await axios.post(`${baseBulkMessagingURL}/optedinUsers`, {userId}, { validateStatus: false, withCredentials: true }).then((response) => {
      //setting the optedinUsers with the response from the API
      return response.data.users;
    });

  }

  export const callstoredCustomers =async ()=>{

    return await axios.get(`${baseBulkMessagingURL}/storedCustomers`, { validateStatus: false, withCredentials: true }).then((response) => {
      //getting the stored users from the response from the API
return response.data.users;
    });
  }

  export const callbroadcastMessage =async (message,toBeBroadcastNo,userId)=>{
    return await axios.post(`${baseBulkMessagingURL}/broadcastMessage`, {message, toBeBroadcastNo, userId}, {validateStatus: false, withCredentials: true}).then((response) => {
      return response.data;

    });
  }

  export const callcreate_new_campaign =async(data)=>{
    return await  axios.post(`${baseBulkMessagingURL}/create_new_campaign`, data, {
      validateStatus: false,
      withCredentials: true
    });

  }

  export const callcreate_new_flow =async(data)=>{
    return await  axios.post(`${baseBulkMessagingURL}/create_new_flow`, data, {
      validateStatus: false,
      withCredentials: true
    });

  }
  export const callActiveagents= async ()=>{
    return await axios.get(`${baseChatSystemURL}/active_agents`, { validateStatus: false, withCredentials: true }).then(async (response) => {
      return response.data.activeAgents;
    });
  }
  export const callActiverooms= async ()=>{
    return await axios.get(`${baseChatSystemURL}/active_rooms`, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.chats;
    });
  }

  export const newescalation =async(room, phoneNo, name, managerID)=>{
    await axios.post(`${baseUserSystemURL}/new_escalation`, {room, customerPhoneNo: phoneNo, escalatedBy: name, managerID}, { validateStatus: false, withCredentials: true }).then((response) => {
      console.log(response.data);
    });
  }
  export const getescalation =async(managerID)=>{
    return await axios.post(`${baseUserSystemURL}/get_escalations`,  {managerID:managerID}, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.escalations;
    });
  }
  export const callLogin=async(email,password)=>{
    return await axios.post(`${baseUserSystemURL}/auth/login`, {email, password}, {validateStatus: false, withCredentials: true}).then((response) => {
      if(response.status === 200 && response.data.success){
        console.log("User Logedin");
        return response.data.user;
      }else{
        console.log("Login Failed");
        return false;
      }
    });
  }


  export const callindiuser=async(id)=>{
    return await axios.post(`${baseUserSystemURL}/indi_user`, {userId: id}, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.foundUser;

    });
  }

  export const callagents= async ()=>{
    return await axios.get(`${baseChatSystemURL}/active_agents`, { validateStatus: false, withCredentials: true }).then(async (response) => {
     console.log("called active agents",response.data.activeAgents);
      return response.data.activeAgents;
    });
  }

  export const callcompletedchats=async(id)=>{
    return await axios.post(`${baseChatSystemURL}/completedChats`, {managerID: id},{ validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.chats;
    });
  }

  export const calltemplatesbymanager=async(id)=>{
    return await axios.post(`${baseChatSystemURL}/allTemplatesByManager`, {managerID: id},{ validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.templates;
    });
  }

  export const callAgents=async()=>{
    return await axios.get(`${baseUserSystemURL}/agents`, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.agents;
    });
  }
  export const callmanagers=async()=>{
    return await axios.get(`${baseUserSystemURL}/managers`, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.managers;
    });
  }

  export const callgetalltemplates=async()=>{
    return await axios.get(`${baseBulkMessagingURL}/get_all_templates`, { validateStatus: false, withCredentials: true }).then((response) => {
      return response.data.allTemplates;
    });
  }

  export const addNewTempplate=async(newTemplate)=>{
    await axios.post(`${baseChatSystemURL}/add_new_template`, newTemplate, {validateStatus: false, withCredentials: true}).then((response) => {
      // console.log(response.data);
      window.location = "/";
    });
  }

  export const updateTempStatus=async(tempID,status)=>{
    await axios.post(`${baseBulkMessagingURL}/updateTempStatus`, {tempID, status},{validateStatus: false, withCredentials: true}).then((response) => {
      console.log(response.data);
    });
  }

export const callgetUsers=async(getRole)=>{
  return await axios.get(`${baseUserSystemURL}/${getRole}`, { validateStatus: false, withCredentials: true }).then((response) => {
    return response.data[`${getRole}`];
  });
}



export const calldelUser=async(url,userID)=>{
 await axios.post(url, {userID} , { validateStatus: false, withCredentials: true }).then((response) => {
    console.log(response);
  });
}

export const callregNewUser=async(newUserData)=>{
  await axios.post(`${baseUserSystemURL}/auth/register`, newUserData, {validateStatus: false, withCredentials: true}).then((response) => {
    if(response.status === 201){
      window.location = '/';
    }else{
      console.log("Registration Failed");
    }
  });
}

export const callassignAgent=async(room, agent,  userName)=>{
  await axios.post(`${baseChatSystemURL}/assign_agent`, {room:room, agentEmail: agent.email, assignedBy: userName}, {validateStatus: false, withCredentials: true}).then((response) => {
    if(response.status === 200){
      console.log("Assignment Done");

    }else{
      console.log("Failed");
    }
  });
}


export const callchangeName=async(newDel)=>{
  return await axios.post(`${baseUserSystemURL}/change_name`, newDel, {validateStatus: false, withCredentials: true}).then((response) => {
   return response;
  });
}

export const callchangePassword=async(newPassword)=>{
  axios.post(`${baseUserSystemURL}/change_password`, newPassword, {validateStatus: false, withCredentials: true}).then((response) => {
    if(response.status === 200){
      // console.log(response.data);
      window.location = "/";
    }
  });
}
export const calllogout=async()=>{
  return await axios.get(`${baseUserSystemURL}/auth/logout`, { validateStatus: false, withCredentials: true }).then((response) => {
     return response
    });
}
