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
