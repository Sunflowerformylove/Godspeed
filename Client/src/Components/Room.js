import "../Style/Room.css";
import { useState, useRef, forwardRef } from "react";
import Socket from "./Socket";
import Cookies from "js-cookie";
export const Room = forwardRef((props, ref) => {
  const chosenRef = useRef(null);
  const className = "room";
  const [chosen, setChosen] = useState(false);
  // function toggleChosen(){
  //     const element = chosenRef.current;
  //     if(!chosen){
  //         element.className = className + " chosen";
  //         setChosen(true);
  //     }
  //     else{
  //         element.className = className;
  //         setChosen(false);
  //     }
  // }
  function createRoom() {
    Socket.connect();
    if (Cookies.get("currentRoom") !== undefined) {
      Socket.emit("leave", Cookies.get("currentRoom"));
    }
    Socket.emit("join", {
      receiver: props.ID,
      sender: Cookies.get("userID"),
    });
    Socket.on("roomID", (roomID) => {
      Cookies.set("currentRoom", roomID);
    });
    if (ref && ref.current) {
      ref.current.style.display = "flex";
      Socket.on("loadMessage", (data) => {
        if(data.length > 0){
          data = JSON.parse(data);
          props.setMessage(data);
        }
        else{
          props.setMessage([]);
        }
      });
    }
  }
  return (
    <>
      <div
        data-id={props.ID}
        className={className}
        ref={chosenRef}
        onClick={createRoom}
      >
        <img
          src="https://placekitten.com/100/100"
          alt=""
          className="recipientAvatar"
        />
        <div className="details">
          <div className="recipientName">{props.name}</div>
          <div className="messagesDetail">
            <div className="lastMessage">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum nec quam id nulla pulvinar pharetra. Ut vulputate, ante
              vel egestas interdum, nunc dolor eleifend purus, ut ornare neque
              ex ac arcu. Nam id pretium lectus. Sed eu mi elementum, fermentum
              nisl sit amet, hendrerit justo. Nunc sed diam luctus, blandit.{" "}
            </div>
            <div className="lastSent"></div>
          </div>
        </div>
      </div>
    </>
  );
});
