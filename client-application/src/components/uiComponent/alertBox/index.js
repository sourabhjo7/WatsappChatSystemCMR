import React from 'react'
import "./index.css"

const AlertBox = ({setShowAlert, alertData}) => {
  return (
      <div className="popUpCon">
        <div className="popUp">
          <h3>New Template Request</h3>
          <div>
            <span>Template Name: <b>{alertData.name}</b></span>
            <span>Requested by: <b>{alertData.requestByName}</b></span>
          </div>
          <a className="alertBtn" href="/template_requests">Go to Request</a>

          <button className="alertBtn" onClick={() => {
            setShowAlert(false);
          }}>Okay</button>
        </div>
      </div>
  )
}

export default AlertBox;
