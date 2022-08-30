import React, { useCallback, useRef, useState } from "react";
import "./DndFlowMap";
import ReactFlow, {
  addEdge,
  Controls,
  MarkerType,
  updateEdge,
  applyNodeChanges,
} from "react-flow-renderer";

let cusid = 0;

const DndFlowMap = ({
  flow,
  nodes,
  setNodes,
  edges,
  setEdges,
  onEdgesChange,
  settemplates,
  setTemplates,
  SelectedTemplates,
  setSelectedTemplates,
  events,
  setEvents
}) => {
  const reactFlowWrapper = useRef(null);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) =>
      setEdges( (eds) =>
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
  const getId = (id) => {
    if(flow){
      return `dndnode_${cusid++}`
    }
    else{
    return `${id}`;
    }

  };
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const edgeUpdateSuccessful = useRef(true);
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const dragData=JSON.parse(event.dataTransfer.getData("application/reactflow") );
        const type=dragData.nodeType;
        const id=dragData.id;
      // check if the dropped element is valid
      if (typeof type === "undefined" || !type||typeof id === "undefined" || !id) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(id),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
      console.log(newNode);
      // if dropped on canva then remove from template
      setSelectedTemplates((curr)=>{
        const ind = curr.indexOf(type);
            if(ind !== -1){
                curr.splice(ind, 1);
            }

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

   const onNodesChange = useCallback(
      (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
      [setNodes]
    );
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
