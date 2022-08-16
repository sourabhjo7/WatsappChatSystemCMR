import React from 'react'
import "./Card.css"

function Card({template}) {

  return (
    <>
    <div className='Card-container'>
   <div className="card">
            <div className="face face1">
                <div className="content">
                    <h3>{template.elementName}</h3>
                </div>
            </div>
            <div className="face face2">
                <div className="content">
                    <p>{template.data.length > 80 ? (
                      `${template.data.substr(0, 80)}...`
                    ) : (
                      template.data
                    )}</p>
                     <button>Select</button>
                     </div>
            </div>
        </div>


        </div>
    </>
  );
};

export default Card
