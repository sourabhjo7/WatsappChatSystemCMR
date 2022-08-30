import React, { useCallback, useRef, useState } from "react";
import "./DndAllFlowsMap";
import ReactFlow, {
  Controls,
} from "react-flow-renderer";
// const edgeTypes = {
//   custom: CustomEdge,
// };




function DndAllFlowsMap({nodes,edges}) {
  const reactFlowWrapper = useRef(null);


      
 


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
            fitView
          >
           <Controls />
          </ReactFlow>
        </div>
      </div>
    </>
  );}


export default DndAllFlowsMap;
