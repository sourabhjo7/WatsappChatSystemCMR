import React, {useRef} from "react";
import "./DndAllFlowsMap";
import ReactFlow, {
  Controls,
} from "react-flow-renderer";




function DndAllFlowsMap({nodes,edges}) {
  const reactFlowWrapper = useRef(null);

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
  );
}


export default DndAllFlowsMap;
