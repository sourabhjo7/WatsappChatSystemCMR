import React, {useState, useEffect} from 'react'


import Sidebar from "./uiComponent/sidebar/index";
import TopCon from "./uiComponent/TopCon";

import PlaceHolderImg from "../images/managerPicPH.png";
import { calldelUser, callgetUsers } from '../Services/Api';

const AllUsers = ({
  baseURL,
  getRole,
  setIsLogedin,
  userRole,
  userName,
  userID,
  noOfPendingTemplates,
  noOfRequestedChats
}) => {

      //defining state variables
      const [usersList, setusersList] = useState([]);

      //function for getting all the users
      const getUsers = async () => {
        let allUsers= await callgetUsers(baseURL,getRole);
        if(getRole === "agents"){
          allUsers = allUsers.filter((agent) => {
            return agent.creatorUID === userID
          })
        }
        setusersList(allUsers);

      }

      //function for deleting a perticular user
      const delUser = async (userID) => {
        let url;

        //selecting the backend route based on role
        if(getRole === "agents"){
          url = `${baseURL}/del_agent`;
        }else{
          url = `${baseURL}/del_manager`;
        }
        await calldelUser(url,userID);
        setusersList((list) => {
          return list.filter((listEle) =>  listEle._id !== userID )
        })
      }


      useEffect(() => {
        getUsers();
      }, []);

      const UserCard = ({user}) => {
        return (
          <div className="userCard">
            <img className="ProfilePic allUserImage" src={PlaceHolderImg} alt="Profile pic" />
            <h3 className="">{user.firstName} {user.lastName}</h3>
            <p>{user.email}</p>

            {user.role === "Manager" ? (
              <a className="joinbtn" href={`/manager/${user._id}`}>View More</a>
            ) : (<></>)}

            <button className="rmBtn" value={user._id} onClick={(e) => {
              delUser(e.target.value);
            }}>Remove</button>
          </div>
        )
      }

      return (
          <div className="rootCon">
              <Sidebar role = {userRole} baseURL={baseURL} setIsLogedin={setIsLogedin} page={getRole} noOfPendingTemplates={noOfPendingTemplates} noOfRequestedChats={noOfRequestedChats}/>
              <div className="dataCon">
                <TopCon userName={userName} page={getRole === "agents" ? "Agents" : "Managers"} />

                <div className="userCon">
                  {usersList.map((user, index) => {
                    return <UserCard key={index} user={user} />
                  })}
                </div>
              </div>

          </div>
      )
}

export default AllUsers;
