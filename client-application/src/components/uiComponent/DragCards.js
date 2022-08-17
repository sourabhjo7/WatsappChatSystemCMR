import React from "react";
import "./DragCards.css";
import { useDrag,useDrop } from "react-dnd"; // drag functionality hook
import { useRef } from 'react'

function DragCards({ template ,deleteTemplate, showDel}) {
    const ref = useRef(null)
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "template",
        item: { templateName: template }, //here template is not object but a single templateName
        collect: (monitor) => ({
          isDragging:!! monitor.isDragging(),
        }),
      }));

  return (
    <div ref={drag} style = {showDel ? {background: "#CDF6E5", color: "#999"} : {background: "#97A4FC"}} className="drag-card">
      <div style={{ border: isDragging ? "5px solid " : "0px" }}className="content2">

        <p>{template} </p>

        {showDel && <button onClick={deleteTemplate} value={template}  className="rmSelectedNoBtn"> &#9587;</button>}

      </div>
    </div>
  );
}

export default DragCards;
