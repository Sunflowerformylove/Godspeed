import "../Style/Room.css";
import { useRef, forwardRef } from "react";
import Socket from "./Socket";
import Cookies from "js-cookie";
import { useState } from "react";
export const Room = forwardRef((props, ref) => {
  const chosenRef = useRef(null);
  const className = "room";
  // const [chosen, setChosen] = useState(false);
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
    Cookies.set("receiver", props.ID, {
      sameSite: "strict",
      secure: true,
    });
    if (ref && ref.current) {
      ref.current.style.display = "flex";
      Socket.on("loadMessage", (data) => {
        if (data.length > 0) {
          props.setMessage(data);
        } else {
          props.setMessage([]);
        }
      });
    }
    props.searchContainerRef.current.style.display = "none";
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
        </div>
      </div>
    </>
  );
});

export const RoomExist = forwardRef((props, ref) => {
  const chosenRef = useRef(null);
  const className = "room";
  // const [chosen, setChosen] = useState(false);
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
  // function setSender(){
  //   if(Cookies.get("currentRoom") === props.roomID){

  //   }
  // }
  function createRoom() {
    if (Cookies.get("currentRoom") !== undefined) {
      Socket.emit("leave", Cookies.get("currentRoom"));
    }
    Socket.emit("joinExistingRoom", props.roomID);
    Socket.on("roomID", (roomID) => {
      Cookies.set("currentRoom", roomID);
    });
    console.log(props.lastMessage);
    Cookies.set("receiver", props.ID, {
      sameSite: "strict",
      secure: true,
    });
    if (ref && ref.current) {
      ref.current.style.display = "flex";
      Socket.on("loadMessage", (data) => {
        if (data.length > 0) {
          props.setMessage(data);
        } else {
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
              {props.sender}: {props.lastMessage}
            </div>
            <div className="lastSent"></div>
          </div>
        </div>
      </div>
    </>
  );
});
