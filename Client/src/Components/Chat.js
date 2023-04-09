/* eslint-disable jsx-a11y/alt-text */
import "../Style/Chat.css";
import Message from "./Message";
import { RoomNav } from "./RoomNav";
import Socket from "./Socket";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [message, setMessage] = useState([]);
  const [allowScroll, setAllowScroll] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [newRoom, setNewRoom] = useState({});
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
      if (event.target.value.trim() !== "") {
        Socket.emit("message", {
          content: event.target.value.trim(),
          senderID: Cookies.get("userID"),
          receiverID: Cookies.get("receiver"),
          room: Cookies.get("currentRoom"),
        });
        setNewRoom({
          roomID: Cookies.get("currentRoom"),
          roomName: Cookies.get("receiver"),
          sender: Cookies.get("userID"),
          recipient: Cookies.get("receiver"),
          lastMessage: event.target.value.trim(),
          timestamp: Date.now(),
        });
        Socket.emit("setLastMessage", {
          sender: Cookies.get("userID"),
          room: Cookies.get("currentRoom"),
          content: event.target.value.trim(),
        });
      }
      event.target.value = "";
      event.target.style.height = "2.5rem";
      Socket.on("getLastMessage", (data) => {
        setCurrentMessage({data: data});
      });
      console.log(currentMessage?.data);
    }
  }
  useEffect(() => {
    if (chatBoxRef && chatBoxRef.current && allowScroll) {
      chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
    }
  }, [message, allowScroll]);
  useEffect(() => {
    let latestMessage = message[message.length - 1];
    setCurrentMessage({ [Cookies.get("currentRoom")]: latestMessage?.content });
  }, [message]);
  Socket.on("message", (data) => {
    setAllowScroll(true);
    setMessage([...message, data]);
  });
  return (
    <>
      <RoomNav
        message={message}
        setMessage={setMessage}
        ref={chatContainerRef}
        currentMessage={currentMessage}
        newRoom={newRoom}
      ></RoomNav>
      <div ref={chatContainerRef} className="chatContainer">
        <div className="chatHeader">
          <img className="recipientAvatar"></img>
          <span className="recipientName"></span>
          <span className="recipientStatus"></span>
        </div>
        <div className="inputWidgets">
          <textarea
            ref={inputRef}
            spellCheck="false"
            onKeyDown={(event) => {
              sendMessage(event);
            }}
            onChange={adjustHeight}
            name="chatText"
            id="textInput"
          />
          <i className="fa-solid fa-paper-plane sendButton"></i>
        </div>
        <div ref={chatBoxRef} className="chatBox">
          {message.map((mess) => {
            return (
              <Message
                key={mess.ID}
                ID={mess.ID}
                sender={mess.sender === Cookies.get("userID")}
                message={mess.content}
                recipientHide={mess.recipientHide}
                senderHide={mess.senderHide}
                setMessage={setMessage}
                messageArray={message}
                allowScroll={allowScroll}
                setAllowScroll={setAllowScroll}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
