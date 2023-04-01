import "../Style/Welcome.css";
import Register from "./Register";
import Login from "./Login";
import {useState } from "react";

export default function Welcome() {
  const [registerCall, setRegisterCall] = useState(false);
  const [loginCall, setLoginCall] = useState(false);
  
  if(registerCall) {
    return (<Register/>);
  }
  else if(loginCall){
    return (<Login/>);
  }
  return (
    <div className="welcomePage">
      <div className="welcomeMessage">
        Welcome to Godspeed
      </div>
      <div className="btn">
        <span onClick={() => {setLoginCall(true)}} className="login">Login</span>
        <span onClick={() => {setRegisterCall(true)}} className="register">Sign up</span>
      </div>
    </div>
  );
}
