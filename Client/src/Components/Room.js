import "../Style/Room.css";
import { useRef, forwardRef } from "react";
import Socket from "./Socket";
import Cookies from "js-cookie";
// import { useState } from "react";
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
          data.forEach((message) => {
            if (message.type === "file") {
              let blob = new Blob([message.file], { type: message.mimetype });
              message.file = URL.createObjectURL(blob);
            }
          });
          data.forEach((message) => {
            if (message.type === "file") {
              let timestamp = message.timestamp;
              let tempArr = [message];
              for (let i = 0; i < data.length; i++) {
                if (data[i].timestamp === timestamp && data[i].type === "file") {
                  tempArr.push(data[i]);
                  data.splice(i, 1);
                }
              }
              data.splice(data.indexOf(message), 1, tempArr);
            }
          })
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
    Cookies.set("receiver", props.ID, {
      sameSite: "strict",
      secure: true,
    });
    if (ref && ref.current) {
      ref.current.style.display = "flex";
      Socket.on("loadMessage", (data) => {
        if (data.length > 0) {
          data.forEach((message) => {
            if (message.type === "file") {
              let blob = new Blob([message.file], { type: message.mimetype });
              message.file = URL.createObjectURL(blob);
            } 
          });
          data.forEach((message, index) => {
            if (message.type === "file") {
              let timestamp = message.timestamp;
              let tempArr = [];
              tempArr.push(message);
              for (let i = 0; i < data.length; i++) {
                if (data[i].timestamp === timestamp && data[i].type === "file" && i !== index) {
                  tempArr.push(data[i]);
                  data.splice(i, 1);
                  i--;
                }
              }
              data.splice(data.indexOf(message), 1, tempArr);
            }
          })
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
              {props.sender}: {props.latestMessage}
            </div>
            <div className="lastSent"></div>
          </div>
        </div>
      </div>
    </>
  );
});
