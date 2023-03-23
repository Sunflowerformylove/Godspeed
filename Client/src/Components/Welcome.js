import "../Style/Welcome.css";
import anime from "animejs/lib/anime.es.js";
import Register from "./Register";
import Login from "./Login";
import { useRef, useEffect, useState } from "react";

export default function Welcome() {
  const [registerCall, setRegisterCall] = useState(false);
  const [loginCall, setLoginCall] = useState(false);
  const svgRef = useRef(null);
  useEffect(() => {
    const elem = svgRef.current;

    anime({
      targets: elem,
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 1500,
      delay: 1000,
      easing: "easeInOutSine",
      stroke: "white",
      loop: true,
    });
  });
  
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
