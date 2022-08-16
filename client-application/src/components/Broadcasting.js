import React, {useState, useEffect} from 'react'
import axios from "axios";


import Sidebar from "./uiComponent/Sidebar";
import TopCon from "./uiComponent/TopCon";

function Broadcasting({baseBulkMessagingURL, baseUserSystemURL, setIsLogedin, userName, userId, noOfRequestedChats}) {

    //defining state variables
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState({});

    const [optedinUsers, setOptedinUsers] = useState([]);
    const [searchedOptedinUsers, setSearchedOptedinUsers] = useState([]);


    const [message, setMessage] = useState("");
    const [newNumbers, setNewNumbers] = useState("");

    const [selectedNos, setSelectedNos] = useState([]);

    const [selNosByCheck, setSelNosByCheck] = useState([]);
    const [selNosByText, setSelNosByText] = useState([]);

    const [populateMessage, setPopulateMessage] = useState("");

    //getting all the approved templates
    const getTemplates = async () => {

      await axios.post(`${baseBulkMessagingURL}/aprovedTemplates`, {userId}, { validateStatus: false, withCredentials: true }).then((response) => {
        //setting the templates with the response from the API
        setTemplates(response.data.templates);
        if(response.data.templates.length > 0){
          setSelectedTemplate({...response.data.templates[0], example: JSON.parse(response.data.templates[0].meta).example});
          setMessage(response.data.templates[0].data.split("|")[0]);
        }
      });
    }

    const getOptedinUsers = async () => {

      let optedinUsers, storedUsers, toBePopulateUsers = [];
      console.log(toBePopulateUsers);
      await axios.post(`${baseBulkMessagingURL}/optedinUsers`, {userId}, { validateStatus: false, withCredentials: true }).then((response) => {
        //setting the optedinUsers with the response from the API
        optedinUsers = response.data.users;
      });

      await axios.get(`${baseBulkMessagingURL}/storedCustomers`, { validateStatus: false, withCredentials: true }).then((response) => {
        //getting the stored users from the response from the API
        storedUsers = response.data.users;
      });

      //gettig name of the customers from the stored users
      for(let optUser of optedinUsers){
        const optUserFullPhoneNo = optUser.countryCode + optUser.phoneCode;

        for(let user of storedUsers){
          // console.log(user.userName, optUserFullPhoneNo);
          if(optUserFullPhoneNo === user.userPhoneNo){
            toBePopulateUsers.push({phoneNo: optUserFullPhoneNo, userName: user.userName});
          }else{
            toBePopulateUsers.push({phoneNo: optUserFullPhoneNo, userName: "{Name}"});
          }
          break;
        }
      }


      setOptedinUsers(toBePopulateUsers);
      setSearchedOptedinUsers(toBePopulateUsers);
    }

    //function for broadcasting a new message
    const broadcast = async () => {

      //getting the numbers for the input container
      let newNumbersArr = newNumbers.split(",");
      newNumbersArr = await newNumbersArr.map((i) => i.replace(" ", ""))

      const toBeBroadcastNo = [...selectedNos, ...newNumbersArr];

      console.log(message);

      if(toBeBroadcastNo.length > 1){
        axios.post(`${baseBulkMessagingURL}/broadcastMessage`, {message, toBeBroadcastNo, userId}, {validateStatus: false, withCredentials: true}).then((response) => {
          console.log(response.data);
          setPopulateMessage("Broadcasting Successfull");
        });
      }else{
        console.log("No Number Selected");
        setPopulateMessage("No Number Selected");
      }

    }

    //searching functionality
    const sortOptedinNumbers = (e, inpType) => {
      const inp = e.target.value;

      setSearchedOptedinUsers(() => {
        return optedinUsers.filter((user) => {
          if(inpType === "Number"){
            return user.phoneNo.includes(inp);
          }else{
            return user.userName.toLowerCase().includes(inp.toLowerCase());
          }

        })
      })
    }

    //function for selecting a number by checking
    const listSelectedNos = async () => {
      const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
      let selectedPhoneNo = await Array.from(checkboxes).map(i => i.value);


      setSelNosByCheck(selectedPhoneNo);
    }

    //function for removing the selected numbers
    const rmSelectedNo = (number) => {

      if(newNumbers.includes(number)){
        let filteredNumbers = newNumbers.replace(number+",", "");
        filteredNumbers = filteredNumbers.replace(number, "");
        setNewNumbers(filteredNumbers);

        setSelNosByText((curr) => {
          curr = curr.filter((num, index) => {
            return num !== number
          });
          return curr;
        })
      }


      const checkboxes = Array.from(document.querySelectorAll('input[type=checkbox]:checked'));

      //Unchecking the checkboxes in the optedin list
      for(let checkbox of checkboxes){
        if(checkbox.value === number){
          checkbox.checked = false;
          break;
        }
      }

      //Removing number for SelNosByCheck
      setSelectedNos((curr) => {
        curr = curr.filter((num) => {
          return num !== number
        });
        return curr;
      })
    }

    useEffect(() => {
      getTemplates();
      getOptedinUsers();
    }, []);

    useEffect(() => {
      setSelectedNos([...selNosByCheck, ...selNosByText])
    }, [selNosByCheck, selNosByText])

    useEffect(() => {
      setTimeout(() => {
        setPopulateMessage("");
      }, 1000)
    }, [populateMessage])

    return (
        <div className="rootCon">
          <Sidebar role="Manager" baseURL={baseUserSystemURL} setIsLogedin={setIsLogedin} page="broadcasting" noOfRequestedChats={noOfRequestedChats}/>

          <div className="dataCon">
            <TopCon userName={userName} page="Broadcast"/>

            <div className="broadcastCon">

              <div className="selTempCon">
                <label>Select a Template: </label>
                <select onChange={(e) => {
                  setSelectedTemplate({...templates[e.target.selectedIndex], example: JSON.parse(templates[e.target.selectedIndex].meta).example});
                  setMessage(templates[e.target.selectedIndex].data.split("|")[0]);
                }}>
                  {templates.map((template, index) => {
                    return (
                      <option key={index}>{template.elementName}</option>
                    )
                  })}
                </select>
              </div>

              <div className="selectedTempCon">

                <div className="det">
                  <span className="tempName">{selectedTemplate.elementName}</span>
                  <span><b>Example</b>: {selectedTemplate.example}</span>
                </div>
                <div className="val">
                  <textarea onChange={(e) => {
                    setMessage(e.target.value);
                  }} value={message}></textarea>
                </div>
              </div>

              <div className="InpNoCon">

                <div className="optinNoCon">
                  <h3>Otp In Numbers: </h3>
                  <div className="searchCon">
                    <input type="number" placeholder="Search by Number" onChange={(e) => {
                      sortOptedinNumbers(e, "Number")
                    }}/>
                    <input type="text" placeholder="Search by Name" onChange={(e) => {
                      sortOptedinNumbers(e, "Name")
                    }}/>
                  </div>
                  <div className="numbersList">
                    {searchedOptedinUsers.map((user, index) => {
                      return (
                        <div key={index}>
                          <label onClick={listSelectedNos} className="checkboxCon">
                            <input type="checkbox" name={user.phoneNo} value={user.phoneNo} />
                            <span className="checkmark"></span>
                          </label>
                          <label htmlFor={user.phoneNo}>{user.phoneNo}</label>
                          <span>{user.userName}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="newNoCon">
                  <h3>Input New Numbers: </h3>
                  <span>Enter comma(,) seperated numbers</span><br/>
                  <textarea onChange={(e) => {
                    setNewNumbers(e.target.value);
                    let newNumbersArr = e.target.value.split(",");
                    newNumbersArr = newNumbersArr.map((i) => i.replace(" ", ""))
                    newNumbersArr = newNumbersArr.filter((number) => {
                      return number.length === 12
                    });

                    setSelNosByText(newNumbersArr);

                  }} value={newNumbers}></textarea><br/>
                </div>

                <div className="selectedNoCon">
                  <h3>Selected Numbers: </h3>
                  <div className="selectedNumbersList">
                    {selectedNos.length>0 ?
                      selectedNos.map((number, index) => {
                      return (
                        <div key={index}>
                          <span>{number}</span>
                          <button className="rmSelectedNoBtn" onClick={(() => {
                            rmSelectedNo(number);
                          })}>&#9587;</button>
                        </div>
                      )
                    }) :
                    <span>No Number Selected...</span>

                  }
                  </div>
                </div>

              </div>


              <div className="brdBtnCon">
                <button className="joinbtn brdCsBtn" onClick={broadcast}>Broadcast</button>
                <span>{populateMessage}</span>
              </div>

            </div>

          </div>
        </div>
    )
}

export default Broadcasting;
