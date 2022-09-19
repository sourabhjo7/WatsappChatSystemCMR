import React, { useState, useEffect } from 'react'
import "./App.scss";

//all the URLs of the backend systems

//importing Router functionality
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

//importing the socket after connection
import {socket} from "./components/chatComponents/socket";

//importing all the necessary components
import Profile from "./components/Profile";

import AllUsers from "./components/AllUsers";
import CreateNewUser from "./components/CreateNewUser";
import Login from "./components/login/index";

import AdminDb from "./components/roleDashboards/AdminDb";
import ManagerDb from "./components/roleDashboards/ManagerDb";
import AgentDb from "./components/roleDashboards/AgentDb";

// import ManagerAssignPage from "./components/ManagerAssignPage";
import Broadcasting from "./components/broadcasting/index";
import Flow from "./components/flow/index";
import Campaign from "./components/campaign/index";
import AllFlows from "./components/allFlows/index";

import NewTemplateRequest from "./components/template/NewTemplateRequest";
import TemplateRequests from "./components/template/TemplateRequests";
import AlertBox from "./components/uiComponent/alertBox/index";

import ManagerChat from "./components/chatComponents/ManagerChat";

import ManagerProfile from "./components/indiManagerProfile/index";
import { ReactFlowProvider } from 'react-flow-renderer';
import { callAssignedChats, callNoPendingTemplates, calltoken} from './Services/Api';

//Importing as lazy so that socket only runs when user is agent or manager
const ChatPage = React.lazy(() => import('./components/chatComponents/ChatPage'));
const ManagerAssign = React.lazy(() => import('./components/ManagerAssignPage'));

let userId;//variable for storing the current id of the user

function App() {

  const [isLogedin, setIsLogedin] = useState(false);//login state variable
  const [userData, setUserData] = useState({});

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [noOfPendingTemplates, setNoOfPendingTemplates] = useState(0);

  const [noOfRequestedChats, setNoOfRequestedChats] = useState(0);


  //Rendring the ChatPage Only if the userRole is Agent
  const ChatPageRender = () => {
    return (
      <>
        <React.Suspense fallback={<></>}>
          {(userData.role === process.env.REACT_APP_AgentRole) && <ChatPage socket={socket} userData={userData} setIsLogedin={setIsLogedin} />}
        </React.Suspense>

      </>
    )
  }

  //Rendring the ManagerAssign Oonly if the userRole is Manager
  const ManagerAssignPage = () => {
    return (
      <>
        <React.Suspense fallback={<></>}>
          {(userData.role === process.env.REACT_APP_ManagerRole) && <ManagerAssign socket={socket} userName={userData.name} userId={userData.user_id} setIsLogedin={setIsLogedin} noOfRequestedChats={noOfRequestedChats}/>}
        </React.Suspense>
      </>
    )
  }
//function for checking the JWT from backend API

  const valToken = async () => {
      const user = await calltoken();
      if(!user){
        setIsLogedin(false);
      }
      else{
        setUserData(user);
        setIsLogedin(true);
        getAssignedChats(user.user_id);
        userId = user.user_id
      }
  }
  //Getting all assigned rooms to this agent
  const getAssignedChats = async (user_id) => {
    const assignList= await callAssignedChats();
    //Filtering assigned rooms for this perticular agent
    const filteredChats = assignList.filter((assined) => {
      return assined.managerID === user_id
    });
      setNoOfRequestedChats(filteredChats.length);
      // console.log(filteredChats);
    };

  //getting the number of pendng templates to show in notification
  const getNoOfPendingTemplates = async () => {
    const data = await callNoPendingTemplates();
    // console.log(data);
      setNoOfPendingTemplates(data);
  }

  const changeLoginState = (user) => {//Function for changing the State after successFull Login
    setUserData(user);
    setIsLogedin(true);
  }

  useEffect(() => {
    socket.on("new_temp", (data) => {
      setNoOfPendingTemplates(data.noOfPendingTemplates)
      setShowAlert(true);
      setAlertData(data);
    })

    socket.on("broadcast", (data) => {
      setTimeout(() => {
        getAssignedChats(userId);
      }, 500);
    });
  }, [socket]);

  useEffect(() => {
    /* validating JWT on every time the component mount */
    valToken();

    /* getting number of pending template on component mount */
    getNoOfPendingTemplates();
  }, [isLogedin]);
  {console.log(process.env.REACT_APP_baseUserSystemURL)}
  /*Rendring dashboard based on the role of the user*/
  const Dashboard = ({role}) => {
    if(role === process.env.REACT_APP_AdminRole){
      return <AdminDb setIsLogedin={setIsLogedin} userData={userData} noOfPendingTemplates={noOfPendingTemplates}/>
    }else if(role === process.env.REACT_APP_ManagerRole){
      return <ManagerDb setIsLogedin={setIsLogedin} userData={userData}  noOfRequestedChats={noOfRequestedChats} socket={socket}/>
    }else if(role === process.env.REACT_APP_AgentRole){
      return <AgentDb setIsLogedin={setIsLogedin} userData={userData} socket={socket}/>
    }
  };

  return (
    <Router>
      <div className="App">
        {isLogedin ? (
          <Routes>

            {/*Home Route have Dashboard */}
            <Route path="/" element={
              <div>
                {userData.role === process.env.REACT_APP_AdminRole && showAlert && <AlertBox setShowAlert={setShowAlert} alertData={alertData}/>}
                <Dashboard role={userData.role} />
              </div>
            } />

            <Route path="/profile" element={
              <div>
                {userData.role === process.env.REACT_APP_AdminRole && showAlert && <AlertBox setShowAlert={setShowAlert} alertData={alertData}/>}
                <Profile
                  setIsLogedin={setIsLogedin}
                  userData={userData}
                  setUserData={setUserData}
                  noOfPendingTemplates={noOfPendingTemplates}/>
              </div>
            } />

            {/*agents Route have AllUsers with role agents */}
            <Route path="/agents" element={
              userData.role === process.env.REACT_APP_AgentRole ? ( //Agents didnt have Access to allAgents page
                <h1>Access Denied!!</h1>
              ) : (
                <AllUsers
                  userRole={userData.role}
                  userName={userData.name}
                  getRole="agents"
                  userID={userData.user_id}
                  setIsLogedin={setIsLogedin}
                  noOfRequestedChats={noOfRequestedChats}
                />
              )
            } />

            {/*managers Route have AllUsers with role managers */}
            <Route path="/managers" element={
              userData.role === process.env.REACT_APP_AgentRole || userData.role === process.env.REACT_APP_ManagerRole ? (//Agents and Managers didnt have Access to allManagers page
                <h1>Access Denied!!</h1>
              ) : (
                <div>
                  {userData.role === process.env.REACT_APP_AdminRole && showAlert && <AlertBox setShowAlert={setShowAlert} alertData={alertData}/>}
                  <AllUsers
                    getRole="managers"
                    setIsLogedin={setIsLogedin}
                    userRole={userData.role}
                    userName={userData.name}
                    userID={userData.user_id}
                    noOfPendingTemplates={noOfPendingTemplates}
                  />
                </div>
              )
            } />

            {/*Broadcasting Route */}
            <Route path="/broadcast" element={
              userData.role === process.env.REACT_APP_ManagerRole ? (//Only Managers have Access to Broadcasting page
                <Broadcasting
                  getRole="managers"
                  setIsLogedin={setIsLogedin}
                  userId={userData.user_id}
                  userName={userData.name}
                  noOfRequestedChats={noOfRequestedChats}
                />
              ) : (
                <h1>Access Denied!!</h1>
              )
            } />

            {/* // flow route for manager to start flow  */}
              <Route path="/flow" element={
              userData.role === process.env.REACT_APP_ManagerRole ? (//Only Managers have Access to Flow Page
                <ReactFlowProvider>
                  <Flow
                  getRole="managers"
                  setIsLogedin={setIsLogedin}
                  userId={userData.user_id}
                  userName={userData.name}
                  noOfRequestedChats={noOfRequestedChats}
                />
                </ReactFlowProvider>
              ) : (
                <h1>Access Denied!!</h1>
              )
            } />

            {/* // flow route for manager to start flow  */}
              <Route path="/campaign" element={
              userData.role === process.env.REACT_APP_ManagerRole ? (//Only Managers have Access to Flow Page
                <ReactFlowProvider>
                  <Campaign
                  getRole="managers"
                  setIsLogedin={setIsLogedin}
                  userId={userData.user_id}
                  userName={userData.name}
                  noOfRequestedChats={noOfRequestedChats}
                />
                </ReactFlowProvider>
              ) : (
                <h1>Access Denied!!</h1>
              )
            } />

            {/* // flow route for manager to start flow  */}
              <Route path="/allflows" element={
              userData.role === process.env.REACT_APP_ManagerRole ? (//Only Managers have Access to Flow Page
                <AllFlows
                  getRole="managers"
                  setIsLogedin={setIsLogedin}
                  userId={userData.user_id}
                  userName={userData.name}
                  noOfRequestedChats={noOfRequestedChats}
                />
              ) : (
                <h1>Access Denied!!</h1>
              )
            } />

            {/*Managers route for submiting new template request to admin */}
            <Route path="/new_template_request" element={
              userData.role === process.env.REACT_APP_AgentRole && userData.role === process.env.REACT_APP_AdminRole ? ( //Admin & Agents didnt have Access to this page
                <h1>Access Denied!!</h1>
              ) : (
                <NewTemplateRequest
                  userName={userData.name}
                  userID={userData.user_id}
                  setIsLogedin={setIsLogedin}
                  noOfRequestedChats={noOfRequestedChats}
                />
              )
            } />

            {/*Admin route for accessing new template request from manager */}
            <Route path="/template_requests" element={
              userData.role === process.env.REACT_APP_AgentRole && userData.role === process.env.REACT_APP_ManagerRole ? ( //Managers & Agents didnt have Access to this page
                <h1>Access Denied!!</h1>
              ) : (

                <div>
                  {userData.role === process.env.REACT_APP_AdminRole && showAlert && <AlertBox setShowAlert={setShowAlert} alertData={alertData}/>}
                  <TemplateRequests
                    userName={userData.name}
                    setIsLogedin={setIsLogedin}
                    noOfPendingTemplates={noOfPendingTemplates}
                    setNoOfPendingTemplates={setNoOfPendingTemplates}
                  />
                </div>

              )
            } />

            {/*route for checking escalated chats for manager */}
            <Route path="/chat_requests" element={
              userData.role === process.env.REACT_APP_ManagerRole ? (
                <ManagerChat socket={socket} userData={userData} setIsLogedin={setIsLogedin} noOfRequestedChats={noOfRequestedChats}/>
              ) : (
                <h1>Access Denied!!</h1>
              )
            } />

            <Route path="/create_new_user" element={
              userData.role === process.env.REACT_APP_AgentRole ? (//Agents didnt have Access to create new user page
                <h1>Access Denied!!</h1>
              ) : (

                <div>
                  {userData.role === process.env.REACT_APP_AdminRole && showAlert && <AlertBox setShowAlert={setShowAlert} alertData={alertData}/>}
                  <CreateNewUser userData={userData} setIsLogedin={setIsLogedin} noOfPendingTemplates={noOfPendingTemplates} noOfRequestedChats={noOfRequestedChats}/>
                </div>
              )
            } />

            <Route path="/chat" element={
              userData.role === process.env.REACT_APP_AgentRole ? (
                <ChatPageRender />
              ) : (
                <h1>Access Denied!!</h1>
              )
            } />

            <Route path="/asign_agent" element={
              userData.role === process.env.REACT_APP_ManagerRole ? ( //Agents didnt have Access to allAgents page
                <ManagerAssignPage />
              ) : (
                <h1>Access Denied!!</h1>
              )
            } />

            <Route path="/manager/:id" element={
              userData.role === process.env.REACT_APP_AdminRole ? ( //Agents didnt have Access to allAgents page
                <div>
                  {userData.role === process.env.REACT_APP_AdminRole && showAlert && <AlertBox setShowAlert={setShowAlert} alertData={alertData}/>}

                  <ManagerProfile
                    userData={userData}
                    setIsLogedin={setIsLogedin}
                    noOfPendingTemplates={noOfPendingTemplates}
                  />
                </div>
              ) : (
                <h1>Access Denied!!</h1>
              )
            } />

          </Routes>
        ) : (
          <Login changeLogin={changeLoginState} />
        )}
      </div>
    </Router>
  );
}

export default App;
