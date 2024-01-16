import "../Style/Welcome.css";
import Register from "./Register";
import Login from "./Login";
import {useState, useContext, useEffect} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Connecting from "./Connecting";
import userContext from "./userData";
import Socket from "./Socket.js";
import { toastPromise } from "./Toast";
import { ChatConfigContext } from "./Setting";

export default function Welcome() {
  const [registerCall, setRegisterCall] = useState(false);
  const [loginCall, setLoginCall] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [user, setUser] = useContext(userContext);
  const [chatConfig, setChatConfig] = useContext(ChatConfigContext);

  async function getSetting() {
    const config = await axios.post("https://localhost:3000/api/getSetting", { ID: user.ID }, { withCredentials: true });
    setChatConfig(config.data.Setting);
  }

  useEffect(() => {
    if (Cookies.get("userSession") !== undefined) {
      axios({
        method: "POST",
        url: "https://localhost:3000/checkSession",
        data: JSON.stringify({ userSession: Cookies.get("userSession") }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.data)
        .then((data) => {
          if (data.accept) {
            Socket.connect();
            user.username = data.user;
            user.ID = data.ID;
            Socket.on("connect", () => {
              setConnecting(true);
              const userData = {
                user: data.user,
                ID: data.ID,
              }
              Socket.emit("getUser", data.ID);
              setUser(userData);
              setConnecting(true);
              toastPromise(getSetting(), "Loading setting...", "Setting loaded!", "Setting failed to load!");
            });
          }
        });
    }
  }, []); 
  
  if(registerCall) {
    return (<Register/>);
  }
  else if(loginCall){
    return (<Login/>);
  }
  else if(connecting){
    return (<Connecting/>);
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
