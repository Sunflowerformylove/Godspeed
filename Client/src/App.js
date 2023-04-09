import Welcome from "./Components/Welcome";
import "./App.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Connecting from "./Components/Connecting";
import Socket from "./Components/Socket";

export default function App() {
  const [connectingCall, setConnectingCall] = useState(false);
  useEffect(() => {
    if (Cookies.get("userSession") !== undefined) {
      axios({
        method: "POST",
        url: "http://localhost:3000/checkSession",
        data: JSON.stringify({ userSession: Cookies.get("userSession") }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.data)
        .then((data) => {
          if (data.accept === true) {
            Socket.connect();
            Socket.on("connect", () => {
              setConnectingCall(true);
            });
          }
        });
    }
  }, []);
  return <>{connectingCall ? <Connecting /> : <Welcome />}</>;
}
