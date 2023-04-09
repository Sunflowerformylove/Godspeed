import Socket, {connectToSocket} from "./Socket";
import Chat from "./Chat";
// import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import "../Style/Connecting.css";

export default function Connecting() {
  const [chatCall, setChatCall] = useState(false);
  useEffect(() => {
    if (Socket.connected) {
      setTimeout(() => {
        setChatCall(true);
      },8000);
    }
  },[])
  if(chatCall) {
    return <Chat />
  }
  return (
    <>
      <div className="loader">
        <div className="galaxy">
          <div className="planet"></div>
          <div className="planet"></div>
          <div className="planet"></div>
          <div className="planet"></div>
        </div>
      </div>
    </>
  );
}
