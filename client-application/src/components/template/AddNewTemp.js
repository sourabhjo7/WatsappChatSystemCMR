import React, {useState} from 'react'
import { AddNewTempplate } from '../../Services/Api';


const nameLabel = "For example, a verification code template for an app will be: Your verification code is {{1}}. Hence, this can be named: app_verification_code. An element name can only be in lowercase alphanumeric characters and underscores. Special characters and white-space are not allowed."
const sampleLabel = "A sample message should be a complete message replacing the placeholder given in the template with a meaningful word/statement/numbers/special characters. The placeholder should start and end with Square brackets. For example, Your verification code is [232323]"

const AddNewTemp = ({baseURL, userName, userID}) => {

    const [newTemplate, setNewTemplate] = useState({
      name: "",
      format: "",
      sample: "",
      requestByName: userName,
      requestByUID: userID
    });

    const subTemplate = async () => {
      await AddNewTempplate(baseURL,newTemplate);
    }

    return (
      <div className="regForm tempCon">

        <div className="form-group">
          <label>Name:</label>

          <label className="subLabel">{nameLabel}</label>

          <input type="text" className="form-control" placeholder="Type Name" onChange={(e) => {
            setNewTemplate((currObj) => {
              return {...currObj, name: e.target.value}
            });
          }}/>
        </div>

        <div className="form-group">
          <label>Format:</label>
          <input type="textarea" className="form-control" placeholder="Type Format" onChange={(e) => {
            setNewTemplate((currObj) => {
              return {...currObj, format: e.target.value}
            });
          }}/>
        </div>

        <div className="form-group">
          <label>Sample:</label>
          <label className="subLabel">{sampleLabel}</label>

          <input type="textarea" className="form-control" placeholder="Type Sample" onChange={(e) => {
            setNewTemplate((currObj) => {
              return {...currObj, sample: e.target.value}
            });
          }}/>
        </div>

        <button className="joinbtn subBtn tempBtn" onClick={subTemplate}>Submit</button>

      </div>
    );
}

export default AddNewTemp
