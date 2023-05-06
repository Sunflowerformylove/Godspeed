import Welcome from "./Components/Welcome";
import "./App.css";
import userData from "./Components/userData";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Connecting from "./Components/Connecting";
import Socket from "./Components/Socket";

export default function App() {
  const [connectingCall, setConnectingCall] = useState(false);
  let user = useContext(userData);
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
          if (data.accept === true) {
            Socket.connect();
            user.username = data.user;
            user.ID = data.ID;
            Socket.on("connect", () => {
              setConnectingCall(true);
            });
          }
        });
    }
  }, []);
  return <>{connectingCall ? <Connecting /> : <Welcome />}</>;
}
