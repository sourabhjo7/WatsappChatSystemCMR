import update from "immutability-helper";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Flow.css";
import Sidebar from "./uiComponent/Sidebar";
import TopCon from "./uiComponent/TopCon";
import Card from "./uiComponent/Card";
import DragCards from "./uiComponent/DragCards";
import DndFlowMap from "./uiComponent/DndFlowMap";
import { ReactFlowProvider } from "react-flow-renderer";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MarkerType,
  updateEdge,
  MiniMap,
  applyNodeChanges,
  onNodesChange,
} from "react-flow-renderer";

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
  const initialNodes = [];
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowtitle,setFlowTitle]=useState("");

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
    setEvents((curr) => {
      if (format === "min") {
        return [...curr, ` ${time_delay / 1000}s`];
      } else {
        return [...curr, ` ${time_delay / 1000}s`];
      }
    });
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
    if (board.indexOf(e.target.value) === -1) {
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

  //   // dropping funnctionality
  //   const [{ isOver }, drop] = useDrop(() => ({
  //     accept: "template",
  //     drop: (item) => addTemplateToBoard(item.templateName),
  //     collect: (monitor) => ({
  //       isOver: !!monitor.isOver(),
  //     }),
  //   }));

  // // adding templates to board section
  // const addTemplateToBoard = (templateName) => {

  //   setBoard((board) => {
  //     if(board.indexOf(templateName) === -1 || events.includes(templateName)){
  //         return [...board, templateName]
  //     }
  //    return [...board];
  //   });

  //   const emptyDiv=" ";
  //   if(board.includes(emptyDiv)){
  //       board.splice(board.indexOf(emptyDiv,1));
  //   }

  //   // when adding we want templateName to be removed from selected area
  //   setSelectedTemplates((curr) => {
  //     const ind = curr.indexOf(templateName);
  //     if(ind!=-1){
  //         curr.splice(ind, 1);
  //     }

  //     console.log(curr);
  //     return [...curr];
  //   });

  // };

  // const deleteBoardTemplate = (e) => {
  //   setBoard((curr) => {
  //     const ind = curr.indexOf(e.target.value);
  //     if(ind!=-1){
  //       curr.splice(ind, 1);
  //     }

  //     console.log(curr);
  //     return [...curr];
  //   });

  //   if(!events.includes(e.target.value)){
  //     // when deleting it should go to  selected template

  //     setSelectedTemplates((curr) => {
  //       if (curr.indexOf(e.target.value) == -1) {
  //         return [...curr, e.target.value];
  //       }
  //       return curr;
  //     });
  //   }

  // };

  const [events, setEvents] = useState([
    "Enqueued",
    "Failed",
    "Read",
    "Sent",
    "Delivered",
    "Delete",
  ]);
  const [keyword, setKeyword] = useState("");
  // const moveCard = useCallback((dragIndex, hoverIndex) => {
  //   console.log("move Card");
  //   setBoard((prevCards) =>
  //     update(prevCards, {
  //       $splice: [
  //         [dragIndex, 1],
  //         [hoverIndex, 0, prevCards[dragIndex]]
  //       ]
  //     })
  //   );
  // }, []);
  const handleKeyword = (e) => {
    setEvents((curr) => {
      return [...curr, keyword];
    });
  };

  // dnd components
let startNode = {}
  const FlowDataSubmit = () => {
    // lets find the start and end
    let FlowData = {};
    let endNodes = [];
    // for every node check every edge if it is the starting node by checking target of edge

    for (let i = 0; i < nodes.length; i++) {
      let flag = 1;
      for (let j = 0; j < edges.length; j++) {
        if (nodes[i].id == edges[j].target) {
          flag = 0;
          break;
        }
      }
      if (flag) {
        startNode = nodes[i];
        break;
      }
    }

    // for final destination targets array as multiple targets can be there
    for (let i = 0; i < nodes.length; i++) {
      let flag = 1;
      for (let j = 0; j < edges.length; j++) {
        if (nodes[i].id == edges[j].source) {
          flag = 0;
          break;
        }
      }
      if (flag) {
        endNodes.push(nodes[i]);
      }
    }

    let tMessageListobj = {};
    console.log(startNode);
    let helperObject = {};

    for (let i = 0; i < nodes.length; i++) {
      // console.log(nodes[i].id);
      helperObject[nodes[i].id] = nodes[i].type;
    }
    // console.log(helperObject);
    for (let i = 0; i < nodes.length; i++) {
      let tMessage,
        events = [];
      let flag = 0;
      templates.forEach((template) => {
        if (template.elementName == nodes[i].type) {
          tMessage = template.data;
          flag = 1;
        }
      });

      let flagend = 0;
      endNodes.forEach((endNode) => {
        if (endNode.type == nodes[i].type) {
          flagend = 1;
        }
      });

      // if node is an template and not in last array
      if (flag && !flagend) {
        // check all edges where source is this node
        for (let j = 0; j < edges.length; j++) {
          if (edges[j].source == nodes[i].id) {
            let event, action;
            let flage = 0;
            templates.forEach((template) => {
              if (template.elementName == helperObject[edges[j].target]) {
                flage = 1;
              }
            });
            if (!flage) {
              let e = helperObject[edges[j].target];
              let str = e.split("");
              let time = "";
              for (let ind = 0; ind < str.length - 1; ind++) {
                time = time + str[ind];
              }

              if (Number(str[0]) >= 0 && Number(str[0]) <= 9) {
                event = Number(time);
              } else {
                event = `!${helperObject[edges[j].target].toLowerCase()}`;
              }
            } else {
              event = undefined;
            }
            for (let k = 0; k < edges.length; k++) {
              if (edges[k].source == edges[j].target) {
                let flagt = 0;
                templates.forEach((template) => {
                  if (template.elementName == helperObject[edges[k].target]) {
                    flagt = 1;
                  }
                });
                if (flagt) {
                  action = helperObject[edges[k].target];
                } else {
                  action = undefined;
                }

                break;
              }
            }
            events.push({ event, action });
          }
        }
        tMessageListobj = {
          tMessage: tMessage,
          events: events,
        };
        const tname = nodes[i].type;
        FlowData[`${tname}`] = tMessageListobj;
      }
      // IF node is template and also in last array that is ending node
      else if (flag && flagend) {
        let event, action;
        event = "!end";
        action = "!end";
        events.push({ event, action });
        tMessageListobj = {
          tMessage: tMessage,
          events: events,
        };
        const tname = nodes[i].type;
        FlowData[`${tname}`] = tMessageListobj;
      }
      // if not template then dont do anything
    }
    return FlowData;

    // if not template then dont do anything
  };
  //---end of function
// Final Submit Function for data of Flow 
const FinalSubmit=async()=>{
  const data={
    title:flowtitle,
    tMessageList:FlowDataSubmit(),
    contactList:selectedNos,
    cid:userId,
    startNode:startNode.data.label
  }
  console.log(data);
  try{
    var response = axios.post(`${baseBulkMessagingURL}/createnewflow`,data,{validateStatus:true,withCredentials:true});
  }
  catch(e){
    console.log(e);
  }
  console.log(response);
}

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
                return <Card template={temp} select={selectTemplate} />;
              })}
            </div>
          </div>
          <div>
            <div style={{ display: "flex" }}>
              <h3>Build Flow:</h3>
              <div>
                <span style={{ fontSize: "20px", marginLeft: "30px" }}>
                  Enter Flow Title:
                </span>
                <input
                  type="text"
                  value={flowtitle}
                  onChange={(e) => setFlowTitle(e.target.value)}
                />
              </div>
              <div>
                <span style={{ fontSize: "20px", marginLeft: "30px" }}>
                  Time Delay:
                </span>
                <input
                  type="number"
                  value={inputTime}
                  onChange={(ele) => {
                    setinputTime(ele.target.value);
                  }}
                />

                <label style={{ fontSize: "20px" }} for="format">
                  Format
                </label>
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
                <input type="submit" onClick={handleSubmit} />
              </div>
              <div>
                <span style={{ fontSize: "20px", marginLeft: "30px" }}>
                  Enter Keyword:
                </span>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <input type="submit" onClick={handleKeyword} />
              </div>
            </div>

            {/* container for selected templates */}
                <div className="selected-flow-area">
                <div className="Selected-container ">
                  {selectedTemplates.map((temp, index) => {
                    return (
                      <DragCards
                        template={temp}
                        deleteTemplate={deleteTemplate}
                        showDel={true}
                        // moveCard={moveCard}
                      />
                    );
                  })}
                </div>
                {/* Events section  */}
                <div className="Selected-container " style={{ width: "20vw" }}>
                  {events.map((temp, index) => {
                    return (
                      <DragCards
                        template={temp}
                        deleteTemplate={deleteTemplate}
                        showDel={false}
                        // moveCard={moveCard}
                      />
                    );
                  })}
                </div>
                {/* this is the board where selected templates are droped  */}
                <div className="Dnd-flow-canva">
                  <DndFlowMap
                    nodes={nodes}
                    setNodes={setNodes}
                    edges={edges}
                    setEdges={setEdges}
                    onEdgesChange={onEdgesChange}
                    templates={templates}
                    setTemplates={setTemplates}
                    selectedTemplates={selectedTemplates}
                    setSelectedTemplates={setSelectedTemplates}
                    events={events}
                    setEvents={setEvents}
                  />
                </div>

                {/* <div className="Selected-container " >
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
              </div> */}
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
          <div className="brdBtnCon">
                <button className="joinbtn brdCsBtn" onClick={FinalSubmit}>Submit</button>
              </div>
        </div>
      </div>
    </div>
  );
}

export default Flow;
