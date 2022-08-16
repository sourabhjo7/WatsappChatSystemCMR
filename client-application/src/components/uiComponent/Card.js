import React from 'react'
import "./Card.css"

function Card({template}) {
    // {templates.map((temp, index) => {
    //     return <p key={index}>{temp.data}</p>
    //   })}
    // console.log(template)
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
                    <p>{template.data}</p>
                    <intput type="submit" ><a href="#">try it out </a></intput>
                     </div>
            </div>
        </div>
        

        </div>
    </>
  );
};

export default Card