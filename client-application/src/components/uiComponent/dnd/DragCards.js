import React from "react";
import "./DragCards.css";

const DragCards = ({template,deleteTemplate, showDel,keyy}) => {
  const onDragStart = (event, {nodeType,id}) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({nodeType,id}));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
    onDragStart={(event) => onDragStart(event, {nodeType:`${template}`,id:`${keyy}`})} draggable
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
