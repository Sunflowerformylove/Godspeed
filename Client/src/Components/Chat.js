/* eslint-disable jsx-a11y/alt-text */
import "../Style/Chat.css";
import Message, { MessageRecipient, MessageSender } from "./Message";
import { RoomNav } from "./RoomNav";
import Socket from "./Socket";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [message, setMessage] = useState([]);
  function adjustHeight() {
    const element = inputRef.current;
    element.style.bottom = "1rem";
    element.style.height = "2.5rem";
    element.style.height =
      parseInt(element.style.height) + parseInt(element.scrollHeight) + "px";
  }
  function sendMessage(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log(Cookies.get("userID"));
      if (event.target.value !== "") {
        Socket.emit("message", {
          content: event.target.value,
          ID: Cookies.get("userID"),
          room: Cookies.get('currentRoom')
        });
      }
      event.target.value = "";
    }
  }
  Socket.on("message", (data) => {
    setMessage([...message, data]);
  });
  return (
    <>
      <RoomNav message = {message} setMessage = {setMessage} ref={chatContainerRef}></RoomNav>
      <div ref={chatContainerRef} className="chatContainer">
        <div className="chatHeader">
          <img className="recipientAvatar"></img>
          <span className="recipientName"></span>
          <span className="recipientStatus"></span>
        </div>
        <div className="inputWidgets">
          <textarea
            ref={inputRef}
            onKeyDown={(event) => {
              sendMessage(event);
            }}
            onChange={adjustHeight}
            name="chatText"
            id="textInput"
          />
          <i className="fa-solid fa-paper-plane sendButton"></i>
        </div>
        <div className="chatBox">
          {message.map((message) => {
            return (
              <Message
                key={Math.random(Date.now())}
                sender={message.sender === Cookies.get("userID")}
                message={message.content}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
