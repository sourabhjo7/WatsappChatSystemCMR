import React, {useState} from 'react';
import "./index.scss"
import { callLogin } from '../../Services/Api';

const Login = ({changeLogin}) => {
  //defining state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //function for loging in a users
  const login = async () => {
     const user= await callLogin(email,password);
     if(user){
      changeLogin(user);
     }
     //changing the state if login seccessful
  }

  return (
      <div className= "loginPage" id='loginPage'>
        <div className="loginCon" id='loginCon'>

          <div className="loginHead" id='loginHead'>
            <h1>Login to Dashboard</h1>
            <p>Enter your email and password below</p>
          </div>


          <div className="form-group" id='form-group'>
            <label>Email</label>
            <input type="email" className="form-control" id='form-control' placeholder="Enter email" onChange={(e) => {
              setEmail(e.target.value);
            }}/>
          </div>
          <div className="form-group" id='form-group'>
            <label>Password</label>
            <input type="password" className="form-control" id='form-control' placeholder="Enter password" onChange={(e) => {
              setPassword(e.target.value);
            }}/>
          </div>
          <button className="colorBtn"id='colorBtn' onClick={login}>Login</button>
        </div>
      </div>
  );
}

export default Login;
