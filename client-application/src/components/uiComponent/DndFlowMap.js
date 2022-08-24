import React, { useCallback, useRef, useState } from "react";
import "./DndFlowMap";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MarkerType,
  updateEdge,
} from "react-flow-renderer";
import CustomEdge from "./CustomEdge";
// const edgeTypes = {
//   custom: CustomEdge,
// };

const initialNodes = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

function DndFlowMap({templates,setTemplates,SelectedTemplates,setSelectedTemplates,events,setEvents}) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "floating",
            markerEnd: {
              type: MarkerType.Arrow,
            },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const edgeUpdateSuccessful = useRef(true);
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
      // if dropped on canva then remove from template
      setSelectedTemplates((curr)=>{
        const ind = curr.indexOf(type);
            if(ind!=-1){
                curr.splice(ind, 1);
            }
      
            console.log(curr);
            return [...curr];
      })
    },
    [reactFlowInstance]
  );
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

const FlowDataSubmit=()=>{
      // lets find the start and end 
      let FlowData ={};
  let  startNode={},endNodes=[];
  // for every node check every edge if it is the starting node by checking target of edge 
 for(let i =0;i<nodes.length;i++){
    let flag=1;  
  for(let j=0;j<edges.length;j++){
      if(nodes[i].id==edges[j].target ){
        flag=0;
        break;
      }
    }
    if(flag){
      startNode=nodes[i];
      break;
    }
    
 }

 // for final destination targets array as multiple targets can be there 
 for(let i =0;i<nodes.length;i++){
  let flag=1;  
for(let j=0;j<edges.length;j++){
    if(nodes[i].id==edges[j].source){
      flag=0;
      break;
    }
  }
  if(flag){
    endNodes.push(nodes[i]);
  }
  
}
let tMessageListobj ={};
console.log(startNode);
  let  helperObject={};  
for(let i=0;i<nodes.length;i++){
  // console.log(nodes[i].id);
      helperObject[nodes[i].id]=nodes[i].type;
  }
// console.log(helperObject);
for(let i=0;i<nodes.length;i++){
    let tMessage, events=[];
    let flag=0;
   templates.forEach(template => {
    if( template.elementName == nodes[i].type){
        tMessage=template.data;
        flag=1;
   }
   });
   let flagend=0;
   endNodes.forEach(endNode => {
    if( endNode.type == nodes[i].type){
        flagend=1;
   }
   });
   
   

    // if node is an template and not in last array 
    if(flag&& !flagend){
      // check all edges where source is this node 
      for(let j =0;j<edges.length;j++){
        if(edges[j].source==nodes[i].id){
          let event,action;
            event= helperObject[edges[j].target].toLowerCase();
            for(let k=0;k<edges.length;k++){
              if(edges[k].source==edges[j].target){
                action= helperObject[edges[k].target];
                break;
              }
            }
            events.push({event,action});

          }
        }
        tMessageListobj={
          tMessage:tMessage,
          events:events
        }
        const tname=nodes[i].type;
        FlowData[`${tname}`]=tMessageListobj;
      } 
      // IF node is template and also in last array that is ending node 
      else if(flag&& flagend){
        let event,action;
        event="!end";
        action="!end";
        events.push({event,action});
        tMessageListobj={
          tMessage:tMessage,
          events:events
        }
        const tname=nodes[i].type;
        FlowData[`${tname}`]=tMessageListobj;

      }
      // if not template then dont do anything 

    }
    console.log(FlowData);

}
//---end of function 
  
  
  /* now we have to use nodes and edges to make a different data structure 
    tMessageList = {
      "app_details": {
        tMessage: "Choose One: | [Option 1] | [Option 2] | [Option 3]",
        events: [{
          event: "Hello",
          action: "app_otp_code"
        }]
      },
      "app_order_confirmation": {
        tMessage: "Your Order with id {{1}} is {{2}}.",
        events: [{
          event: "test",
          action: "app_test_code"
        }]
      },
      "app_otp_code": {
        tMessage: "Your OTP for {{1}} is {{2}}.",
        events: [{
          event: "!end",
          action: "!end"
        }]
      },
    
    },

  
  */
  return (
    <>
      <div style={{ height: "100%" }} className="dndflow">
        <div
          style={{ height: "100%" }}
          className="reactflow-wrapper"
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            
           <Controls />
          </ReactFlow>
          <div className="rmbtn">
              <button  onClick={FlowDataSubmit}> Save</button>
            </div>
        </div>
      </div>
    </>
  );
}

export default DndFlowMap;
