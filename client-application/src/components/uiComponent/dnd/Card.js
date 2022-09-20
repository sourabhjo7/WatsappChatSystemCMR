import React from "react";
import "./Card.scss";

const Card = ({ templates,template, select,setTemplates }) => {

    const change=(e)=>{
      let i=0,ind=0;
      templates.forEach(temp=>{
        if(temp === template){
          ind=i;
        }
        i++;
      });

      // as we dont have same temolates
      setTemplates((templates)=>{
        templates[ind].data=e.target.value;
        return [...templates];
      });
    }

    return (
      <>
        <div className="Card-container">
          <div className="card">
            <div className="face face1">
              <div className="content">
                <h3>{template.elementName}</h3>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <textarea onChange={change} style={{border:"none",overflow:"hidden"}} rows="3" cols="25" >
                  {template.data}
                </textarea>
                <button onClick={select} value={template.elementName}>
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default Card;
