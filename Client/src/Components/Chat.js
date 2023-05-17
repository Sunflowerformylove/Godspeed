/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import "../Style/Chat.css";
import Message, { MessageImage, MessageFile, Video } from "./Message";
import { RoomNav } from "./RoomNav";
import userData from "./userData";
import Socket from "./Socket"
import { useEffect, useRef, useState, useContext } from "react";
import { ImagePreview } from "./Preview";
import Cookies from "js-cookie";
import NotificationOptions from "./Popup";

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
  let user = useContext(userData);
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
  const videoExtension = [
    ".mp4",
    ".webm",
    ".ogg",
    ".avi",
    ".mov",
    ".flv",
    ".wmv"];

  useEffect(() => {
    if (files.length !== 0) {
      previewFileRef.current.style.display = "flex";
    } else {
      previewFileRef.current.style.display = "none";
    }
  }, [files]);

  useEffect(() => {
    if (chatBoxRef && chatBoxRef.current && allowScroll) {
      chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
    }
  }, [message, allowScroll]);

  Socket.on("message", (data) => {
    setAllowScroll(true);
    if (data.type === "text" && checkURL(data.content)) {
      data.type = "youtube";
      data.extension = "mp4";
      data.file = data.content;
    }
    setMessage([...message, data]);
  });

  function checkURL(url) {
    if (typeof url !== "string") return false;
    const regex = new RegExp("^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$");
    if (regex.test(url)) {
      return true;
    }
    return false;
  }

  Socket.once("file", (data) => {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === "file" && data[i].content !== "deleted" && !checkURL(data[i].file)) {
        const blob = new Blob([data[i].file], { type: data[i].mimetype});
        data[i].file = window.URL.createObjectURL(blob);
        console.log(data[i].file);
      }
    }
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
        message.type = "youtube";
        message.extension = "mp4";
        message.file = message.content;
      }
    })
    setMessage([...message, ...data]);
    setAllowScroll(true);
  });

  Socket.on("getLatestMessage", (data) => {
    setLatestMessage({ [data.room]: data });
  });

  function openFileInput() {
    sendFilesRef.current.click();
  }

  function convertFileSize(size) {
    let stage = 0;
    while (size >= 1024) {
      size /= 1024;
      stage++;
    }
    return size.toFixed(2) + ["B", "KB", "MB", "GB", "TB"][stage];
  }

  function previewFile() {
    const element = sendFilesRef.current;
    const fileArr = Array.from(element.files);
    const tempArr = [];
    fileArr.forEach((file) => {
      const isImage = imageExtension.some((ext) => file.name.endsWith(ext));
      if (isImage) {
        tempArr.push({
          url: URL.createObjectURL(file),
          type: "image",
          name: file.name,
          timestamp: Date.now(),
          size: file.size,
        });
      } else {
        tempArr.push({
          url: URL.createObjectURL(file),
          type: "file",
          name: file.name,
          timestamp: Date.now(),
          size: file.size,
        });
      }
    });
    setFiles([...files, ...tempArr]);
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
      Object.values(iconRef.current).forEach((icon) => {
        icon.style.transform = "scale(1)";
      });
      event.preventDefault();
      if (event.target.value.trim() !== "") {
        Socket.emit("message", {
          content: event.target.value.trim(),
          senderID: user.ID,
          receiverID: user.receiver,
          room: Cookies.get("currentRoom"),
        });

        const receiver = await axios("https://localhost:3000/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: { receiverID: user.receiver },
        }).then((response) => response.data[0].user);
        setNewRoom({
          roomID: Cookies.get("currentRoom"),
          roomName: receiver,
          sender: user.ID,
          recipient: user.receiver,
          lastMessage: event.target.value.trim(),
          timestamp: Date.now(),
        });
        Socket.emit("setLatestMessage", {
          room: Cookies.get("currentRoom"),
          content: event.target.value.trim(),
          timestamp: Date.now(),
          sender: user.ID,
        });
      }
      inputRef.current.style.width = "100%";
      previewFileRef.current.style.width = "100%";
      event.target.value = "";
      event.target.style.height = "2.5rem";
    }
  }

  function sendFiles(event) {
    if (event.key === "Enter") {
      Object.values(iconRef.current).forEach((icon) => {
        icon.style.transform = "scale(1)";
      });
      const element = sendFilesRef.current;
      const fileArr = Array.from(element.files);
      const formData = new FormData();
      fileArr.forEach((file) => {
        formData.append("file", file);
      });
      formData.append("sender", user.ID);
      formData.append("receiver", user.receiver);
      formData.append("room", Cookies.get("currentRoom"));
      axios.post("https://localhost:3000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFiles([]);
      element.value = "";
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
              onChange={previewFile}
              className="sendFilesInput"
              style={{ display: "none" }}
              multiple
            />
          </div>
          <div className="previewContainer">
            <div ref={previewFileRef} className="previewFile">
              <div className="addFile" onClick={openFileInput}>
                <i className="fa-solid fa-plus"></i>
              </div>
              {files.map((file) => {
                return file.type === "image" ? (
                  <ImagePreview key={Math.random(Date.now())} url={file.url} />
                ) : null;
              })}
            </div>
            <textarea
              ref={inputRef}
              spellCheck="false"
              onKeyDown={(event) => {
                sendMessage(event);
                sendFiles(event);
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
              mess.type === "text" ?
                <Message
                  key={mess.ID}
                  ID={mess.ID}
                  sender={parseInt(mess.sender) === user.ID}
                  message={mess.content}
                  recipientHide={mess.recipientHide}
                  senderHide={mess.senderHide}
                  setMessage={setMessage}
                  messageArray={message}
                  allowScroll={allowScroll}
                  setAllowScroll={setAllowScroll}
                /> : imageExtension.some((ext) => !Array.isArray(mess) ? ext === mess.extension.toLowerCase() : ext === mess[0].extension.toLowerCase()) ?
                  <MessageImage key={Math.random() * (9999999999 - 0)}
                    ID={Array.isArray(mess) ? mess[0].ID : mess.ID}
                    messageArray={message}
                    setMessage={setMessage}
                    timestamp={Array.isArray(mess) ? mess[0].timestamp : mess.timestamp}
                    sender={Array.isArray(mess) ? parseInt(mess[0].sender) === user.ID : parseInt(mess.sender) === user.ID}
                    senderHide={Array.isArray(mess) ? mess[0].senderHide : mess.senderHide}
                    recipientHide={Array.isArray(mess) ? mess[0].recipientHide : mess.recipientHide}
                    isArray={Array.isArray(mess)}
                    uuid={Array.isArray(mess) ? mess[0].uuid : mess.uuid}
                    src={mess} />
                  :
                  videoExtension.some((ext) => !Array.isArray(mess) ? ext === mess.extension.toLowerCase() : ext === mess[0].extension.toLowerCase()) || mess.type === "youtube" ?
                    <Video url={mess.file} ID={Array.isArray(mess) ? mess[0].ID : mess.ID}
                      key = {mess.ID}
                      messageArray={message}
                      setMessage={setMessage}
                      timestamp={Array.isArray(mess) ? mess[0].timestamp : mess.timestamp}
                      type={mess.type}
                      sender={Array.isArray(mess) ? parseInt(mess[0].sender) === user.ID : parseInt(mess.sender) === user.ID}
                      senderHide={Array.isArray(mess) ? mess[0].senderHide : mess.senderHide}
                      recipientHide={Array.isArray(mess) ? mess[0].recipientHide : mess.recipientHide}
                      uuid={Array.isArray(mess) ? mess[0].uuid : mess.uuid}></Video>
                    :
                    <MessageFile recipientHide={mess.recipientHide}
                      ID={mess.ID}
                      messageArray={message}
                      setMessage={setMessage}
                      senderHide={mess.senderHide} sender={parseInt(mess.sender) === user.ID} filename={mess.filename} key={Math.random() * (9999999999 - 0)} size={convertFileSize(mess.size)} mimetype={mess.mimetype} name={mess.originalname} type={mess.extension} />
            );
          })}
        </div>
      </div>
    </>
  );
}