import React, {useState} from 'react';
import axios from "axios";
import "./Login.css"


function Login({baseURL, changeLogin}) {

    //defining state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //function for loging in a users
    const login = async () => {
      axios.post(`${baseURL}/auth/login`, {email, password}, {validateStatus: false, withCredentials: true}).then((response) => {
        if(response.status === 200 && response.data.success){
          console.log("User Logedin");
          changeLogin(response.data.user);//changing the state if login seccessful
        }else{
          console.log("Login Failed");
        }
      });
    }

    return (
        <div className= "loginPage">
          <div className="loginCon">

            <div className="loginHead">
              <h1>Login to Dashboard</h1>
              <p>Enter your email and password below</p>
            </div>


            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" placeholder="Enter email" onChange={(e) => {
                setEmail(e.target.value);
              }}/>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" placeholder="Enter password" onChange={(e) => {
                setPassword(e.target.value);
              }}/>
            </div>
            <button className="colorBtn" onClick={login}>Login</button>
          </div>
        </div>
    );
}

export default Login;
