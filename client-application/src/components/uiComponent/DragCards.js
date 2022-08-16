import React from 'react'
import "./DragCards.css"
function DragCards({template}) {
  return (
    <div className="drag-card">
        <div className="content2">
            <p>{template}</p>
        </div>
    </div>
  )
}

export default DragCards
