import React from "react";
import "./DragCards.css";
function DragCards({ template ,deleteTemplate }) {
  return (
    <div className="drag-card">
      <div className="content2">
        <p >{template} </p> <button onClick={deleteTemplate} value={template}  className="rmSelectedNoBtn"> &#9587;</button> 
       
      </div>
    </div>
  );
}

export default DragCards;
