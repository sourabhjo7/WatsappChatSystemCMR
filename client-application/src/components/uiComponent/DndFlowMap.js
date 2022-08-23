import React, { useCallback, useRef, useState } from "react";
import "./DndFlowMap";
import ReactFlow, {
  ReactFlowProvider,
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

// const FlowDataSubmit=()=>{
//       // lets find the start and end 
//   const startNode={},endNodes=[];
//   // for every node check every edge if it is the starting node by checking target of edge 
//  for(let i =0;i<nodes.length;i++){
//     let flag=1;  
//   for(let j=0;j<edges.length;j++){
//       if(nodes[i].id==edges[j].target ){
//         flag=0;
//         break;
//       }
//     }
//     if(flag){
//       startNode=nodes[i];
//       break;
//     }
    
//  }

//  // for final destination targets array as multiple targets can be there 
//  for(let i =0;i<nodes.length;i++){
//   let flag=1;  
// for(let j=0;j<edges.length;j++){
//     if(nodes[i].id==edges[j].source){
//       flag=0;
//       break;
//     }
//   }
//   if(flag){
//     endNodes.push(nodes[i]);
//   }
  
// }
// const tMessageList ={};
// // console.log(startNode,endNodes);

// let node=startNode;
// for(let i=0;i<nodes.length;i++){
//     let tMessage, events=[];
//     let flag=0;
//    templates.forEach(template => {
//     if( template.elementName == nodes[i].type){
//         tMessage=template.data;
//         flag=1;
//    }
//    });
//     // if node is an template
//     if(flag){
//       // check all edges where source is this node 
//       for(let j =0;j<edges.length;j++){
//         if(edges[j].source==nodes[i].id){
//           let event,action;
//           for(let x=0;x<nodes.length;x++){
//             if(nodes[x].id==edges[j].target){
//               event=nodes[x].type;
//               break;
//             }
//           }

//           for(let k=0;k<nodes.length;k++){
//             if(nodes[k].type==event){
//               for(let x=0;x<edges.length;x++){
//                 if(nodes[k].id==edges[x].source){

//                 }
//             }
//           }
//           events.push();
//         }
//       }
//     }


// }

// //---end of function 
//   }
//-------x---------
  
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
        </div>
      </div>
    </>
  );
}

export default DndFlowMap;
