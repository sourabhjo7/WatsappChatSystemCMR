import React from "react";
import "./DragCards.css";
// import { useDrag,useDrop } from "react-dnd"; // drag functionality hook
import { useRef } from 'react'

function DragCards({template,deleteTemplate, showDel}) {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
      };
    
  return (
    <div 
    onDragStart={(event) => onDragStart(event, `${template}`)} draggable
    style = {showDel ? {background: "#CDF6E5", color: "#999"} : {background: "#97A4FC"}}
      className="drag-card"
      >
      <div className="content2">

        <p>{template} </p>

        {showDel && <button onClick={deleteTemplate} value={template}  className="rmSelectedNoBtn"> &#9587;</button>}

      </div>
    </div>
  );
}

export default DragCards;
