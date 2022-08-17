import React from "react";
import "./DragCards.css";
import { useDrag,useDrop } from "react-dnd"; // drag functionality hook
import { useRef } from 'react'

function DragCards({ id,template ,index,moveCard,deleteTemplate, showDel}) {
    const ref = useRef(null)
    const [{ handlerId }, drop] = useDrop({
        accept: "template",
        collect(monitor) {
          return {
            handlerId: monitor.getHandlerId(),
          }
        },
        hover(item, monitor) {
          if (!ref.current) {
            return;
          }
          const dragIndex = item.index
          const hoverIndex = index
          // Don't replace items with themselves
          if (dragIndex === hoverIndex) {
            return
          }
          // Determine rectangle on screen
          const hoverBoundingRect = ref.current?.getBoundingClientRect()
          // Get vertical middle
          const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
          // Determine mouse position
          const clientOffset = monitor.getClientOffset()
          // Get pixels to the top
          const hoverClientY = clientOffset.y - hoverBoundingRect.top
          // Only perform the move when the mouse has crossed half of the items height
          // When dragging downwards, only move when the cursor is below 50%
          // When dragging upwards, only move when the cursor is above 50%
          // Dragging downwards
          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return
          }
          // Dragging upwards
          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return
          }
          // Time to actually perform the action
          moveCard(dragIndex, hoverIndex)
          item.index = hoverIndex
        },
      });

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "template",
        item: { id:id,index:index,templateName: template }, //here template is not object but a single templateName
        collect: (monitor) => ({
          isDragging:!! monitor.isDragging(),
        }),
      }));
      drag(drop(ref))
  return (
    <div ref={ref} style = {showDel ? {background: "#CDF6E5", color: "#999"} : {background: "#97A4FC"}} data-handler-id={handlerId} className="drag-card">
      <div style={{ border: isDragging ? "5px solid " : "0px" }}className="content2">

        <p>{template} </p>

        {showDel && <button onClick={deleteTemplate} value={template}  className="rmSelectedNoBtn"> &#9587;</button>}

      </div>
    </div>
  );
}

export default DragCards;
