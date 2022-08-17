import React from "react";
import "./DragCards.css";
import { useDrag } from "react-dnd"; // drag functionality hook 

function DragCards({ template ,deleteTemplate }) {
    
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "template",
        item: { templateName: template }, //here template is not object but a single templateName
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }));

  return (
    <div   ref={drag}  className="drag-card">
      <div   style={{ border: isDragging ? "5px solid pink" : "0px" }}className="content2">
        <p >{template} </p> <button onClick={deleteTemplate} value={template}  className="rmSelectedNoBtn"> &#9587;</button> 
       
      </div>
    </div>
  );
}

export default DragCards;
