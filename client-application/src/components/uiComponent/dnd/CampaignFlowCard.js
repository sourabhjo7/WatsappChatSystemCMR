import React from 'react'
import "./Card.css";

const CampaignFlowCard = ({flow,select}) => {
  return (
    <>
    <div className="Card-container">
      <div className="card">
        <div className="face face1">
          <div className="content">
            <h3>{flow.title}</h3>
          </div>
        </div>
        <div className="face face2">
          <div className="content">

            <button onClick={()=>{
                select(flow.title,flow._id)
                }} >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}
export default CampaignFlowCard
