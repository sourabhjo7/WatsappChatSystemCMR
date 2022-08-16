import React from 'react';
import "./Sidebar.css";
import axios from "axios";

const OverviewIcon = () => {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5232 8.94116H8.54412L13.1921 13.5891C13.3697 13.7667 13.6621 13.7812 13.8447 13.6091C14.9829 12.5367 15.7659 11.0912 15.9956 9.46616C16.035 9.18793 15.8041 8.94116 15.5232 8.94116ZM15.0576 7.03528C14.8153 3.52176 12.0076 0.714119 8.49412 0.471767C8.22589 0.453237 8 0.679413 8 0.948236V7.5294H14.5815C14.8503 7.5294 15.0762 7.30352 15.0576 7.03528ZM6.58824 8.94116V1.96206C6.58824 1.68118 6.34147 1.45029 6.06353 1.48971C2.55853 1.985 -0.120585 5.04705 0.00412089 8.71675C0.132356 12.4856 3.37736 15.5761 7.14794 15.5288C8.6303 15.5103 10 15.0326 11.1262 14.2338C11.3585 14.0691 11.3738 13.727 11.1724 13.5256L6.58824 8.94116Z" fill="#3751FF"/>
  </svg>
}

const NewUserIcon = () => {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.4 7.19999C3.2825 7.19999 4 6.48249 4 5.59999C4 4.71749 3.2825 3.99999 2.4 3.99999C1.5175 3.99999 0.8 4.71749 0.8 5.59999C0.8 6.48249 1.5175 7.19999 2.4 7.19999ZM13.6 7.19999C14.4825 7.19999 15.2 6.48249 15.2 5.59999C15.2 4.71749 14.4825 3.99999 13.6 3.99999C12.7175 3.99999 12 4.71749 12 5.59999C12 6.48249 12.7175 7.19999 13.6 7.19999ZM14.4 7.99999H12.8C12.36 7.99999 11.9625 8.17749 11.6725 8.46499C12.68 9.01749 13.395 10.015 13.55 11.2H15.2C15.6425 11.2 16 10.8425 16 10.4V9.59999C16 8.71749 15.2825 7.99999 14.4 7.99999ZM8 7.99999C9.5475 7.99999 10.8 6.74749 10.8 5.19999C10.8 3.65249 9.5475 2.39999 8 2.39999C6.4525 2.39999 5.2 3.65249 5.2 5.19999C5.2 6.74749 6.4525 7.99999 8 7.99999ZM9.92 8.79999H9.7125C9.1925 9.04999 8.615 9.19999 8 9.19999C7.385 9.19999 6.81 9.04999 6.2875 8.79999H6.08C4.49 8.79999 3.2 10.09 3.2 11.68V12.4C3.2 13.0625 3.7375 13.6 4.4 13.6H11.6C12.2625 13.6 12.8 13.0625 12.8 12.4V11.68C12.8 10.09 11.51 8.79999 9.92 8.79999ZM4.3275 8.46499C4.0375 8.17749 3.64 7.99999 3.2 7.99999H1.6C0.7175 7.99999 0 8.71749 0 9.59999V10.4C0 10.8425 0.3575 11.2 0.8 11.2H2.4475C2.605 10.015 3.32 9.01749 4.3275 8.46499Z" fill="#3751FF"/>
  </svg>

}

const LogoutIcon = () => {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.2313 9.86558L13.9 9.09683C14.0344 8.37183 14.0344 7.62808 13.9 6.90308L15.2313 6.13433C15.3844 6.04683 15.4531 5.86558 15.4031 5.69683C15.0563 4.58433 14.4656 3.57808 13.6938 2.74058C13.575 2.61246 13.3813 2.58121 13.2313 2.66871L11.9 3.43746C11.3406 2.95621 10.6969 2.58433 10 2.34058V0.806206C10 0.631206 9.87814 0.478081 9.70627 0.440581C8.55939 0.184331 7.38439 0.196831 6.29377 0.440581C6.12189 0.478081 6.00002 0.631206 6.00002 0.806206V2.34371C5.30627 2.59058 4.66252 2.96246 4.10002 3.44058L2.77189 2.67183C2.61877 2.58433 2.42814 2.61246 2.30939 2.74371C1.53752 3.57808 0.946895 4.58433 0.60002 5.69996C0.546895 5.86871 0.61877 6.04996 0.771895 6.13746L2.10314 6.90621C1.96877 7.63121 1.96877 8.37496 2.10314 9.09996L0.771895 9.86871C0.61877 9.95621 0.55002 10.1375 0.60002 10.3062C0.946895 11.4187 1.53752 12.425 2.30939 13.2625C2.42814 13.3906 2.62189 13.4218 2.77189 13.3343L4.10314 12.5656C4.66252 13.0468 5.30627 13.4187 6.00314 13.6625V15.2C6.00314 15.375 6.12502 15.5281 6.29689 15.5656C7.44377 15.8218 8.61877 15.8093 9.70939 15.5656C9.88127 15.5281 10.0031 15.375 10.0031 15.2V13.6625C10.6969 13.4156 11.3406 13.0437 11.9031 12.5656L13.2344 13.3343C13.3875 13.4218 13.5781 13.3937 13.6969 13.2625C14.4688 12.4281 15.0594 11.4218 15.4063 10.3062C15.4531 10.1343 15.3844 9.95308 15.2313 9.86558ZM8.00002 10.5C6.62189 10.5 5.50002 9.37808 5.50002 7.99996C5.50002 6.62183 6.62189 5.49996 8.00002 5.49996C9.37814 5.49996 10.5 6.62183 10.5 7.99996C10.5 9.37808 9.37814 10.5 8.00002 10.5Z" fill="#3751FF"/>
  </svg>
}

const AgentIcon = () => {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 8C10.2094 8 12 6.20937 12 4C12 1.79063 10.2094 0 8 0C5.79063 0 4 1.79063 4 4C4 6.20937 5.79063 8 8 8ZM10.9937 9.01875L9.5 15L8.5 10.75L9.5 9H6.5L7.5 10.75L6.5 15L5.00625 9.01875C2.77812 9.125 1 10.9469 1 13.2V14.5C1 15.3281 1.67188 16 2.5 16H13.5C14.3281 16 15 15.3281 15 14.5V13.2C15 10.9469 13.2219 9.125 10.9937 9.01875Z" fill="#3751FF"/>
  </svg>
}

function Sidebar({role, baseURL, setIsLogedin, page, noOfPendingTemplates=0, noOfRequestedChats=0}) {
    const logOut = async () => {
      await axios.get(`${baseURL}/auth/logout`, { validateStatus: false, withCredentials: true }).then((response) => {
        setIsLogedin(false);
        window.location = "/";
      });
    }


    const Links = () => {
      if(role === "Admin"){
        return <div className="links">
          <a href="/" className={page === "overview" ? "active" : "nonActive"}>
            <OverviewIcon />
            <span>Overview</span>
          </a>

          <a href="/managers" className={page === "managers" ? "active" : "nonActive"}>
            <AgentIcon />
            <span>Managers</span>
          </a>

          <a href="/template_requests" className={page === "templateRequests" ? "active" : "nonActive"}>
            <AgentIcon />
            <span>Template Requests <b className="floatNumber">{noOfPendingTemplates}</b></span>
          </a>

          <a href="/create_new_user" className={page === "createNewUser" ? "active" : "nonActive"}>
            <NewUserIcon />
            <span>Add new Manager</span>
          </a>

        </div>;
      }else if(role === "Agent"){
        return <div className="links">

          <a href="/" className={page === "overview" ? "active" : "nonActive"}>
            <OverviewIcon />
            <span>Overview</span>
          </a>

          <a href="/chat" className={page === "chat" ? "active" : "nonActive"}>
            <NewUserIcon />
            <span>Chat</span>
          </a>
        </div>;
      }else{
        return <div className="links">

          <a href="/" className={page === "overview" ? "active" : "nonActive"}>
            <OverviewIcon />
            <span>Overview</span>
          </a>

          <a href="/agents" className={page === "agents" ? "active" : "nonActive"}>
            <AgentIcon />
            <span>Agents</span>
          </a>

          <a href="/asign_agent" className={page === "assignAgents" ? "active" : "nonActive"}>
            <AgentIcon />
            <span>Assign Agents</span>
          </a>

          <a href="/chat_requests" className={page === "chat" ? "active" : "nonActive"}>
            <AgentIcon />
            <span>Chat Requests <b className="floatNumber">{noOfRequestedChats}</b></span>
          </a>

          <a href="/broadcast" className={page === "broadcasting" ? "active" : "nonActive"}>
            <NewUserIcon />
            <span>Broadcast</span>
          </a>
          <a href="/flow" className={page === "flow" ? "active" : "nonActive"}>
            <NewUserIcon />
            <span>Flow</span>
          </a>
          <a href="/allflows" className={page === "AllFlows" ? "active" : "nonActive"}>
            <NewUserIcon />
            <span>All Flows</span>
          </a>

          <a href="/new_template_request" className={page === "newTemplateRequest" ? "active" : "nonActive"}>
            <NewUserIcon />
            <span>Your Template</span>
          </a>

          <a href="/create_new_user" className={page === "createNewUser" ? "active" : "nonActive"}>
            <NewUserIcon />
            <span>Add new Agent</span>
          </a>


        </div>;
      }

    }


    return (
        <div className="sidebar">
          <h1>Logo</h1>


          <Links />

          <div className="logoutCon" onClick={logOut}>
            <LogoutIcon/>
            <span className="logoutBtn">LogOut</span>
          </div>
        </div>
    )
}

export default Sidebar;
