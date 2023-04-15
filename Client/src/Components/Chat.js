/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import "../Style/Chat.css";
import Message from "./Message";
import { RoomNav } from "./RoomNav";
import Socket from "./Socket";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const inputRef = useRef(null);
  const previewFileRef = useRef(null);
  const iconRef = useRef([]);
  const chatContainerRef = useRef(null);
  const chatBoxRef = useRef(null);
  const inputWidgetRef = useRef(null);
  const sendFilesRef = useRef(null);
  const [message, setMessage] = useState([]);
  const [allowScroll, setAllowScroll] = useState(true);
  const [newRoom, setNewRoom] = useState({});
  const [latestMessage, setLatestMessage] = useState({});
  const [files, setFiles] = useState([]);
  const imageExtension = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "svg",
    "webp",
    "tiff",
    "heif",
    "eps",
  ];

  function openFileInput() {
    sendFilesRef.current.click();
  }

  function previewFile() {
    const element = previewFileRef.current;
    element.files.forEach((file) => {
      const containImageExtension = imageExtension.some((extension) => {
        return file.filename.includes(extension);
      });
      if (containImageExtension) {
        setFiles([
          ...files,
          {
            url: URL.createObjectURL(file),
            type: "image",
            filename: file.filename,
            size: file.size,
          },
        ]);
      }
      else{
        setFiles([...files, { url: URL.createObjectURL(file), type: "file", filename: file.filename, size: file.size }]);
      }
    });
  }

  function adjustHeight() {
    const element = inputRef.current;
    element.style.bottom = "1rem";
    element.style.height = "2.5rem";
    element.style.height =
      parseInt(element.style.height) + parseInt(element.scrollHeight) + "px";
  }
  async function sendMessage(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.target.value.trim() !== "") {
        Socket.emit("message", {
          content: event.target.value.trim(),
          senderID: Cookies.get("userID"),
          receiverID: Cookies.get("receiver"),
          room: Cookies.get("currentRoom"),
        });

        const receiver = await axios("http://localhost:3000/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: { receiverID: Cookies.get("receiver") },
        }).then((response) => response.data[0].user);
        setNewRoom({
          roomID: Cookies.get("currentRoom"),
          roomName: receiver,
          sender: Cookies.get("userID"),
          recipient: Cookies.get("receiver"),
          lastMessage: event.target.value.trim(),
          timestamp: Date.now(),
        });
        Socket.emit("setLatestMessage", {
          room: Cookies.get("currentRoom"),
          content: event.target.value.trim(),
          timestamp: Date.now(),
          sender: Cookies.get("userID"),
          message: "This is set Latest MeSSAGE",
        });
      }
      event.target.value = "";
      event.target.style.height = "2.5rem";
    }
  }

  function expandInputText(event) {
    if (event.target.value.length !== 0) {
      Object.values(iconRef.current).forEach((icon) => {
        icon.style.transform = "scale(0)";
      });
      inputRef.current.style.width = "128%";
      previewFileRef.current.style.width = "128%";
    } else {
      Object.values(iconRef.current).forEach((icon) => {
        icon.style.transform = "scale(1)";
      });
      inputRef.current.style.width = "100%";
      previewFileRef.current.style.width = "100%";
    }
  }

  Socket.on("getLatestMessage", (data) => {
    setLatestMessage({ [data.room]: data });
  });

  useEffect(() => {
    if (chatBoxRef && chatBoxRef.current && allowScroll) {
      chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
    }
  }, [message, allowScroll]);
  Socket.on("message", (data) => {
    setAllowScroll(true);
    setMessage([...message, data]);
  });
  return (
    <>
      <RoomNav
        message={message}
        setMessage={setMessage}
        latestMessage={latestMessage}
        ref={chatContainerRef}
        newRoom={newRoom}
      ></RoomNav>
      <div ref={chatContainerRef} className="chatContainer">
        <div className="chatHeader">
          <img className="recipientAvatar"></img>
          <span className="recipientName"></span>
          <span className="recipientStatus"></span>
        </div>
        <div ref={inputWidgetRef} className="inputWidgets">
          <div className="miscWidget">
            <i
              ref={(el) => (iconRef.current[0] = el)}
              className="fa-solid fa-microphone widgetIcon"
            ></i>
            <i
              ref={(el) => (iconRef.current[1] = el)}
              onClick={openFileInput}
              className="fa-solid fa-image widgetIcon sendFiles"
            ></i>
            <input
              ref={sendFilesRef}
              type="file"
              name="fileMess"
              id=""
              className="sendFilesInput"
              style={{ display: "none" }}
            />
          </div>
          <div className="previewContainer">
            <div ref={previewFileRef} className="previewFile"></div>
            <textarea
              ref={inputRef}
              spellCheck="false"
              onKeyDown={(event) => {
                sendMessage(event);
              }}
              onChange={(event) => {
                expandInputText(event);
                adjustHeight();
              }}
              name="chatText"
              id="textInput"
            ></textarea>
          </div>
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
