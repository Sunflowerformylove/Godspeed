import "../Style/Room.css";
import { useRef, forwardRef } from "react";
import userData from "./userData";
import Socket from "./Socket";
import Cookies from "js-cookie";
import { useContext } from "react";
const imageExtension = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".svg",
  ".webp",
  ".tiff",
  ".heif",
  ".eps",
];
export const Room = forwardRef((props, ref) => {
  const chosenRef = useRef(null);
  const className = "room";
  let user = useContext(userData);
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
    const currentRoom = Cookies.get("currentRoom");
    if (currentRoom !== undefined) {
      Socket.emit("leave", currentRoom);
    }
    Socket.emit("join", {
      receiver: props.ID,
      sender: user.ID,
    });
    Socket.on("roomID", (roomID) => {
      Cookies.set("currentRoom", roomID);
    });
    user.receiver = props.ID;
    if (ref && ref.current) {
      ref.current.style.display = "flex";
      Socket.on("loadMessage", (data) => {
        console.log(data);
        if (data.length > 0) {
          data.forEach((message) => {
            if (message.type === "file" && imageExtension.some(extension => extension === message.mimetype.toLowerCase())) {
              let blob = new Blob([message.file], { type: message.mimetype });
              message.file = URL.createObjectURL(blob);
            }
          });
          data.forEach((message) => {
            if (message.type === "file" && imageExtension.some(extension => extension === message.mimetype.toLowerCase())) {
              let uuid = message.uuid;
              let tempArr = [message];
              for (let i = 0; i < data.length; i++) {
                if (data[i].uuid === uuid && data[i].type === "file" && imageExtension.some(extension => extension === data[i].extension.toLowerCase())) {
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
  let user = useContext(userData);
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
  function checkURL(url) {
    const regex = new RegExp("^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$");
    if (regex.test(url)) {
      return true;
    }
    return false;
  }
  function createRoom() {
    const currentRoom = Cookies.get("currentRoom");
    if (currentRoom !== undefined) {
      Socket.emit("leave", currentRoom);
    }
    Socket.emit("joinExistingRoom", props.roomID);
    Socket.on("roomID", (roomID) => {
      Cookies.set("currentRoom", roomID);
    });
    user.receiver = props.ID;
    if (ref && ref.current) {
      ref.current.style.display = "flex";
      Socket.on("loadMessage", (data) => {
        if (data.length > 0) {
          data.forEach((message) => {
            if (message.type === "file" && message.content !== "deleted") {
              let blob = new Blob([message.file], { type: message.mimetype });
              message.file = URL.createObjectURL(blob);
            }
          });
          data.forEach((message, index) => {
            if (message.type === "file" && imageExtension.some(extension => extension === message.extension.toLowerCase())) {
              let uuid = message.uuid;
              let tempArr = [];
              tempArr.push(message);
              for (let i = 0; i < data.length; i++) {
                if (data[i].uuid === uuid && data[i].type === "file" && i !== index && imageExtension.some(extension => extension === data[i].extension.toLowerCase())) {
                  tempArr.push(data[i]);
                  data.splice(i, 1);
                  i--;
                }
              }
              data.splice(data.indexOf(message), 1, tempArr);
            }
          })
          data.forEach(message => {
            if (message.type === "text" && checkURL(message.content)) {
              message.type = "video";
              message.extension = "mp4";
              message.file = message.content;
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
