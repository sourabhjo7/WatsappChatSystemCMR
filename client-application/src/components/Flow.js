import update from 'immutability-helper'
import React, { useState, useEffect,useCallback } from "react";
import axios from "axios";
import "./Flow.css";
import Sidebar from "./uiComponent/Sidebar";
import TopCon from "./uiComponent/TopCon";
import Card from "./uiComponent/Card";
import DragCards from "./uiComponent/DragCards";
import { useDrop } from "react-dnd";


function Flow({
  baseBulkMessagingURL,
  baseUserSystemURL,
  setIsLogedin,
  userName,
  userId,
  noOfRequestedChats,
}) {
  //defining state variables
  const [templates, setTemplates] = useState([]);

  const [optedinUsers, setOptedinUsers] = useState([]);
  const [searchedOptedinUsers, setSearchedOptedinUsers] = useState([]);

  const [newNumbers, setNewNumbers] = useState("");

  const [selectedNos, setSelectedNos] = useState([]);

  const [selNosByCheck, setSelNosByCheck] = useState([]);
  const [selNosByText, setSelNosByText] = useState([]);

  const [inputTime, setinputTime] = useState(0);
  const [time_delay, setTime_delay] = useState(0);
  const [format, setformat] = useState("min");

  //getting all the approved templates
  const getTemplates = async () => {
    await axios
      .post(
        `${baseBulkMessagingURL}/aprovedTemplates`,
        { userId },
        { validateStatus: false, withCredentials: true }
      )
      .then((response) => {
        //setting the templates with the response from the API
        setTemplates(response.data.templates);
      });
  };

  const getOptedinUsers = async () => {
    let optedinUsers,
      storedUsers,
      toBePopulateUsers = [];
    await axios
      .post(
        `${baseBulkMessagingURL}/optedinUsers`,
        { userId },
        { validateStatus: false, withCredentials: true }
      )
      .then((response) => {
        //setting the optedinUsers with the response from the API
        optedinUsers = response.data.users;
      });

    await axios
      .get(`${baseBulkMessagingURL}/storedCustomers`, {
        validateStatus: false,
        withCredentials: true,
      })
      .then((response) => {
        //getting the stored users from the response from the API
        storedUsers = response.data.users;
      });

    //gettig name of the customers from the stored users
    for (let optUser of optedinUsers) {
      const optUserFullPhoneNo = optUser.countryCode + optUser.phoneCode;

      for (let user of storedUsers) {
        // console.log(user.userName, optUserFullPhoneNo);
        if (optUserFullPhoneNo === user.userPhoneNo) {
          toBePopulateUsers.push({
            phoneNo: optUserFullPhoneNo,
            userName: user.userName,
          });
        } else {
          toBePopulateUsers.push({
            phoneNo: optUserFullPhoneNo,
            userName: "{Name}",
          });
        }
        break;
      }
    }

    setOptedinUsers(toBePopulateUsers);
    setSearchedOptedinUsers(toBePopulateUsers);
  };

  //searching functionality
  const sortOptedinNumbers = (e, inpType) => {
    const inp = e.target.value;

    setSearchedOptedinUsers(() => {
      return optedinUsers.filter((user) => {
        if (inpType === "Number") {
          return user.phoneNo.includes(inp);
        } else {
          return user.userName.toLowerCase().includes(inp.toLowerCase());
        }
      });
    });
  };

  //function for selecting a number by checking
  const listSelectedNos = async () => {
    const checkboxes = document.querySelectorAll(
      "input[type=checkbox]:checked"
    );
    let selectedPhoneNo = await Array.from(checkboxes).map((i) => i.value);

    setSelNosByCheck(selectedPhoneNo);
  };

  //function for removing the selected numbers
  const rmSelectedNo = (number) => {
    if (newNumbers.includes(number)) {
      let filteredNumbers = newNumbers.replace(number + ",", "");
      filteredNumbers = filteredNumbers.replace(number, "");
      setNewNumbers(filteredNumbers);

      setSelNosByText((curr) => {
        curr = curr.filter((num, index) => {
          return num !== number;
        });
        return curr;
      });
    }

    const checkboxes = Array.from(
      document.querySelectorAll("input[type=checkbox]:checked")
    );

    //Unchecking the checkboxes in the optedin list
    for (let checkbox of checkboxes) {
      if (checkbox.value === number) {
        checkbox.checked = false;
        break;
      }
    }

    //Removing number for SelNosByCheck
    setSelectedNos((curr) => {
      curr = curr.filter((num) => {
        return num !== number;
      });
      return curr;
    });
  };

  const getAcutalTime = () => {
    if (format === "min") {
      setTime_delay(inputTime * 60 * 1000);
    } else if (format === "sec") {
      setTime_delay(inputTime * 1000);
    }
  };
  useEffect(() => {
    getAcutalTime();
  }, [format, inputTime]);

  let dummyData = {
    msg_array: ["hi", "hello"],
    contact_list: [9549408165, 7845321246],
    triggers: {
      hi: 2,
    },
    time_delay: time_delay,
  };
  const handleSubmit = async (e) => {
    const { data } = await axios.post(
      `${baseBulkMessagingURL}/createnewflow`,
      dummyData,
      { validateStatus: false, withCredentials: true }
    );
    console.log(data.data);
  };

  useEffect(() => {
    getTemplates();
    getOptedinUsers();
  }, []);

  useEffect(() => {
    setSelectedNos([...selNosByCheck, ...selNosByText]);
  }, [selNosByCheck, selNosByText]);

  const [board, setBoard] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  // to select a component
  const selectTemplate = (e) => {
    if(board.indexOf(e.target.value) === -1){
      setSelectedTemplates((curr) => {
        if (curr.indexOf(e.target.value) === -1) {
            return [...curr, e.target.value];
        }
        return curr;
      });
    }

  };
  const deleteTemplate = (e) => {
    setSelectedTemplates((curr) => {
      const ind = curr.indexOf(e.target.value);
      curr.splice(ind, 1);
      console.log(curr);
      return [...curr];
    });
  };

  // dropping funnctionality
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "template",
    drop: (item) => addTemplateToBoard(item.templateName),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));


  // adding templates to board section
  const addTemplateToBoard = (templateName) => {

    setBoard((board) => {
      if(board.indexOf(templateName) === -1 || events.includes(templateName)){
          return [...board, templateName]
      }
     return [...board];
    });

    const emptyDiv=" ";
    if(board.includes(emptyDiv)){
        board.splice(board.indexOf(emptyDiv,1));
    }

    // when adding we want templateName to be removed from selected area
    setSelectedTemplates((curr) => {
      const ind = curr.indexOf(templateName);
      if(ind!=-1){
          curr.splice(ind, 1);
      }

      console.log(curr);
      return [...curr];
    });

  };

  const deleteBoardTemplate = (e) => {
    setBoard((curr) => {
      const ind = curr.indexOf(e.target.value);
      if(ind!=-1){
        curr.splice(ind, 1);
      }

      console.log(curr);
      return [...curr];
    });

    if(!events.includes(e.target.value)){
      // when deleting it should go to  selected template

      setSelectedTemplates((curr) => {
        if (curr.indexOf(e.target.value) == -1) {
          return [...curr, e.target.value];
        }
        return curr;
      });
    }

  };

  const [events,setEvents] =useState(["Enqueued", "Failed", "Read","Sent","Delivered","Delete"]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    console.log("move Card");
    setBoard((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]]
        ]
      })
    );
  }, []);

  return (
    <div className="rootCon">
      <Sidebar
        role="Manager"
        baseURL={baseUserSystemURL}
        setIsLogedin={setIsLogedin}
        page="flow"
        noOfRequestedChats={noOfRequestedChats}
      />

      <div className="dataCon">
        <TopCon userName={userName} page="Flow" />

        <div>
          <div>
            <h3>Templates:</h3>
            {/* card component   */}
            <div className="cards-container">
              {templates.map((temp, index) => {
                return (
                  <Card template={temp} key={index} select={selectTemplate} />
                );
              })}
            </div>
          </div>
          <div>
            <h3>Build Flow:</h3>

            {/* container for selected templates */}
            <div className="selected-flow-area">
              <div className="Selected-container ">
                {selectedTemplates.map((temp, index) => {
                  return (
                    <DragCards
                      key={index}
                      index={index}
                      id={index}
                      template={temp}
                      deleteTemplate={deleteTemplate}
                      showDel={true}
                      moveCard={moveCard}
                    />
                  );
                })}
              </div>
             {/* Events section  */}
              <div className="Selected-container ">
                {events.map((temp, index) => {
                  return (
                    <DragCards
                    key={index}
                    index={index}
                    id={index}
                    template={temp}
                    deleteTemplate={deleteTemplate}
                    showDel={false}
                    moveCard={moveCard}
                    />
                  );
                })}
              </div>
              {/* this is the board where selected templates are droped  */}
              <div className="Selected-container "ref={drop}>
                {board.map((temp, index) => {
                  return (
                    <DragCards
                    key={index}
                    index={index}
                    id={index}
                    template={temp}
                    deleteTemplate={deleteBoardTemplate}
                    showDel={true}
                    moveCard={moveCard}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="InpNoCon">
            <div className="optinNoCon">
              <h3>Otp In Numbers: </h3>
              <div className="searchCon">
                <input
                  type="number"
                  placeholder="Search by Number"
                  onChange={(e) => {
                    sortOptedinNumbers(e, "Number");
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by Name"
                  onChange={(e) => {
                    sortOptedinNumbers(e, "Name");
                  }}
                />
              </div>
              <div className="numbersList">
                {searchedOptedinUsers.map((user, index) => {
                  return (
                    <div key={index}>
                      <label onClick={listSelectedNos} className="checkboxCon">
                        <input
                          type="checkbox"
                          name={user.phoneNo}
                          value={user.phoneNo}
                        />
                        <span className="checkmark"></span>
                      </label>
                      <label htmlFor={user.phoneNo}>{user.phoneNo}</label>
                      <span>{user.userName}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="newNoCon">
              <h3>Input New Numbers: </h3>
              <span>Enter comma(,) seperated numbers</span>
              <br />
              <textarea
                onChange={(e) => {
                  setNewNumbers(e.target.value);
                  let newNumbersArr = e.target.value.split(",");
                  newNumbersArr = newNumbersArr.map((i) => i.replace(" ", ""));
                  newNumbersArr = newNumbersArr.filter((number) => {
                    return number.length === 12;
                  });

                  setSelNosByText(newNumbersArr);
                }}
                value={newNumbers}
              ></textarea>
              <br />
            </div>

            <div className="selectedNoCon">
              <h3>Selected Numbers: </h3>
              <div className="selectedNumbersList">
                {selectedNos.length > 0 ? (
                  selectedNos.map((number, index) => {
                    return (
                      <div key={index}>
                        <span>{number}</span>
                        <button
                          className="rmSelectedNoBtn"
                          onClick={() => {
                            rmSelectedNo(number);
                          }}
                        >
                          &#9587;
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <span>No Number Selected...</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3>Time Delay</h3>
            <input
              type="number"
              value={inputTime}
              onChange={(ele) => {
                setinputTime(ele.target.value);
              }}
            />

            <label for="format">Format</label>
            <select
              value={format}
              onChange={(e) => {
                setformat(e.target.value);
              }}
              name="format"
              id="format"
            >
              <option value="min">minutes</option>
              <option value="sec"> seconds</option>
            </select>
            <h1>{time_delay}</h1>
            <input type="submit" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flow;
