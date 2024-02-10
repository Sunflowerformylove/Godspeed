import axios from "axios";
import "../Style/Chat.css";
import Message, { MessageImage, MessageFile, Video, Audio } from "./Message";
import ChatHeader from "./ChatHeader";
import { RoomNav } from "./RoomNav";
import userContext from "./userData";
import Socket from "./Socket"
import { useEffect, useRef, useState, useContext } from "react";
import { ImagePreview, VideoPreview, FilePreview } from "./Preview";
import Cookies from "js-cookie";
import AudioRecorder from "./AudioRecorder";
import { ChatConfigContext } from "./Setting";
import { ChatSetting } from "./ChatSetting";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";
import { toastSuccess } from "./Toast";
import Reply from "./Reply";
// import Call from "./Call";

export default function Chat() {
  const inputRef = useRef(null);
  const previewFileRef = useRef(null);
  const iconRef = useRef([]);
  const chatContainerRef = useRef(null);
  const chatBoxRef = useRef(null);
  const generalSettingRef = useRef(null);
  const inputWidgetRef = useRef(null);
  const audioRecorderRef = useRef(null);
  const [message, setMessage] = useState([]);
  const [allowScroll, setAllowScroll] = useState(true);
  const [newRoom, setNewRoom] = useState({});
  const [latestMessage, setLatestMessage] = useState({});
  const [files, setFiles] = useState([]);
  const [customFiles, setCustomFiles] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [replyType, setReplyType] = useState("");
  const [replyID, setReplyID] = useState(-1);
  const [isReply, setIsReply] = useState(false);
  const [user, setUser] = useContext(userContext);
  const [startTimer, setStartTimer] = useState(false);
  const [Setting, setSetting] = useContext(ChatConfigContext);
  const [themeName, setThemeName] = useState("");
  const replyRef = useRef(null);
  const callResponseRef = useRef(null);
  const callRef = useRef(null);
  let recordingTime = 0;
  let recordingProgress = 0;
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
    ".mkv",
    ".wmv"];
  const audioExtension = [
    ".mp3",
    ".wav",
    ".aac",
    ".ogg",
    ".wma",
    ".m4a"
  ]
  useEffect(() => {
    if (customFiles.length !== 0) {
      previewFileRef.current.style.display = "flex";
    } else {
      previewFileRef.current.style.display = "none";
    }
  }, [customFiles]);

  function formatTheme() {
    if (chatBoxRef.current.classList.contains("light")) {
      chatBoxRef.current.classList.remove("light");
      inputWidgetRef.current.classList.remove("light");
    }
    else if (chatBoxRef.current.classList.contains("sunset")) {
      chatBoxRef.current.classList.remove("sunset");
      inputWidgetRef.current.classList.remove("sunset");
    }
  }

  function turnLight() {
    chatBoxRef.current.classList.add("light");
    setThemeName("light");
    inputWidgetRef.current.classList.add("light");
  }

  function turnDark() {
    setThemeName("");
    chatBoxRef.current.classList.remove("light");
    inputWidgetRef.current.classList.remove("light");
  }

  function turnSunset() {
    chatBoxRef.current.classList.add("sunset");
    setThemeName("sunset");
    inputWidgetRef.current.classList.add("sunset");
  }

  function turnSystem() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      turnDark();
    }
    else {
      turnLight();
    }
  }

  useEffect(() => {
    //load setting
    //load theme
    formatTheme();
    if (Setting.Appearance.Theme === "Light") {
      turnLight();
    }
    else if (Setting.Appearance.Theme === "Dark") {
      turnDark();
    }
    else if (Setting.Appearance.Theme === "Sunset") {
      turnSunset();
    }
    else if (Setting.Appearance.Theme === "System") {
      turnSystem();
    }
    //load accent
    //load font size
  }, [Setting])

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

  Socket.once("file", (data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === "file" && data[i].content !== "deleted" && !checkURL(data[i].file)) {
        const blob = new Blob([data[i].file], { type: data[i].mimetype });
        data[i].file = window.URL.createObjectURL(blob);
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

  function addFiles() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    fileInput.multiple = true;
    fileInput.addEventListener("change", (event) => {
      const tempFiles = Array.from(event.target.files);
      files.push(...tempFiles);
      setFiles(files);
      previewFile();
      fileInput.remove();
    });
    fileInput.click();
  }

  const audioAPI = {
    isRecording: false,
    audioStream: null,
    audioRecorder: null,
    start: async function () {
      if (!this.isRecording) {
        this.isRecording = true;
      }
      if (!this.audioStream) {
        this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      if (!this.audioRecorder) {
        this.audioRecorder = new MediaRecorder(this.audioStream);
      }
      this.audioRecorder.start();
      if (this.audioRecorder.state === "recording") {
        setStartTimer(true);
      }
      this.audioRecorder.ondataavailable = async (event) => {
        const blob = new Blob([event.data], { type: "audio/wav" });
        const file = new File([blob], "audio.wav", { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", file);
        formData.append("room", Cookies.get("currentRoom"));
        formData.append("sender", user.ID);
        formData.append("receiver", user.receiver);
        await axios.post("https://localhost:3000/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      }
    },
    stop: function () {
      if (this.isRecording) {
        this.isRecording = false;
        setStartTimer(false);
      }
      if (this.audioRecorder && this.audioRecorder.state === "recording" && this.audioStream) {
        this.audioRecorder.stop();
        this.audioStream.getTracks().forEach(track => track.stop());
        this.audioRecorder.addEventListener("stop", () => {
          toastSuccess("Audio recorded successfully");
        });
        this.audioRecorder = null;
        this.audioStream = null;
      }
    },
    toggle: function () {
      if (this.isRecording) {
        this.stop();
      } else {
        this.start();
      }
    }
  }

  function checkURL(url) {
    if (typeof url !== "string") return false;
    const regex = new RegExp("^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$");
    if (regex.test(url)) {
      return true;
    }
    return false;
  }

  function convertFileSize(size) {
    let stage = 0;
    while (size >= 1024) {
      size /= 1024;
      stage++;
    }
    return size.toFixed(2) + ["B", "KB", "MB", "GB", "TB"][stage];
  }

  function toggleAudioRecorderVisibility() {
    const recorder = audioRecorderRef.current;
    recorder.classList.toggle("visible");
  }

  function previewFile() {
    const tempArr = [];
    files.forEach((file) => {
      const isImage = imageExtension.some((ext) => file.name.endsWith(ext));
      const isVideo = videoExtension.some((ext) => file.name.endsWith(ext));
      if (isImage) {
        tempArr.push({
          url: URL.createObjectURL(new Blob([file, { type: file.mimetype }])),
          type: "image",
          name: file.name,
          timestamp: Date.now(),
          size: file.size,
          dateModified: file.lastModifiedDate,
        });
      }
      else if (isVideo) {
        tempArr.push({
          url: URL.createObjectURL(new Blob([file, { type: file.mimetype }])),
          type: "video",
          name: file.name,
          timestamp: Date.now(),
          size: file.size,
          dateModified: file.lastModifiedDate,
        });
      }
      else {
        tempArr.push({
          url: URL.createObjectURL(new Blob([file, { type: file.mimetype }])),
          type: "." + file.name.split(".").pop(),
          name: file.name,
          timestamp: Date.now(),
          size: file.size,
          dateModified: file.lastModifiedDate,
        });
      }
    });
    setCustomFiles([...tempArr]);
  };

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
          isFiltered: JSON.parse(Setting.ProfanityFilter),
          replier: isReply ? user.ID : -1,
          reply: isReply ? replyID : -1,
          type: replyType,
          replyMessage: replyMessage,
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
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });
      formData.append("sender", user.ID);
      formData.append("receiver", user.receiver);
      formData.append("room", Cookies.get("currentRoom"));
      formData.append("reply", isReply ? replyID : -1);
      axios.post("https://localhost:3000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFiles([]);
      setCustomFiles([]);
    }
  }

  function expandInputText(event) {
    if (event.target.value.length !== 0) {
      Object.values(iconRef.current).forEach((icon) => {
        icon.style.transform = "scale(0)";
      });
      inputRef.current.style.width = "128%";
      previewFileRef.current.style.width = "128%";
      replyRef.current.style.width = "124.5%";
    } else {
      Object.values(iconRef.current).forEach((icon) => {
        icon.style.transform = "scale(1)";
      });
      inputRef.current.style.width = "100%";
      previewFileRef.current.style.width = "100%";
      replyRef.current.style.width = "96.5%";
    }
  }

  return (
    <>
      {/* <Call caller = {2} callee = {1}></Call> */}
      <ChatSetting ref={generalSettingRef} />
      <RoomNav
        message={message}
        setMessage={setMessage}
        latestMessage={latestMessage}
        ref={chatContainerRef}
        newRoom={newRoom}
        generalSettingRef={generalSettingRef}
        themeName={themeName}
      ></RoomNav>
      <div ref={chatContainerRef} className="chatContainer">
        <ChatHeader src="https://placekitten.com/200/300" themeName={themeName} ></ChatHeader>
        <AudioRecorder ref={audioRecorderRef} flag={{ timer: startTimer, setTimer: setStartTimer }}></AudioRecorder>
        <div ref={inputWidgetRef} className="inputWidgets">
          <div className="miscWidget">
            <IonIcon
              icon={Icon.micOutline}
              className="widgetIcon"
              onClick={() => {
                toggleAudioRecorderVisibility();
                audioAPI.toggle();
              }}
              ref={(el) => (iconRef.current[0] = el)}>
            </IonIcon>
            <IonIcon
              ref={(el) => (iconRef.current[1] = el)}
              onClick={addFiles}
              icon={Icon.apertureOutline}
              className="widgetIcon sendFiles">
            </IonIcon>
          </div>
          <div className="previewContainer" >
            <div ref={previewFileRef} className="previewFile">
              <div className="addFile" onClick={addFiles}>
                <IonIcon icon={Icon.addCircleOutline} className="plus"></IonIcon>
              </div>
              {customFiles.map((file) => {
                return file.type === "image" ? (
                  <ImagePreview key={Math.random(Date.now())}
                    fileArr={files}
                    setFileArr={setFiles}
                    customFilesArr={customFiles}
                    setCustomFilesArr={setCustomFiles}
                    url={file.url} />
                ) : file.type === "video" ? (
                  <VideoPreview key={Math.random(Date.now())}
                    fileArr={files}
                    setFileArr={setFiles}
                    customFilesArr={customFiles}
                    setCustomFilesArr={setCustomFiles}
                    url={file.url} />
                ) :
                  <FilePreview key={Math.random(Date.now())}
                    fileArr={files}
                    setFileArr={setFiles}
                    customFilesArr={customFiles}
                    setCustomFilesArr={setCustomFiles}
                    url={file.url} type={file.type} name={file.name} size={convertFileSize(file.size)} />
              })}
            </div>
            <Reply 
            setIsReply={setIsReply}
            setReplyID={setReplyID}
            setReplyMessage={setReplyMessage}
            setReplyTo={setReplyTo}
            setReplyType={setReplyType}
            isReply={isReply}
            replyID={replyID}
            replyMessage={replyMessage}
            replyTo={replyTo}
            replyType={replyType}
            ref={replyRef}
            ></Reply>
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
          <IonIcon icon={Icon.paperPlaneOutline} className="sendButton"></IonIcon>
        </div>
        <div ref={chatBoxRef} className="chatBox">
          {message.map((mess) => {
            return (
              mess.type === "text" ?
                <Message
                  key={mess.ID}
                  ID={mess.ID}
                  senderID={mess.sender}
                  sender={parseInt(mess.sender) === user.ID}
                  message={mess.content}
                  recipientHide={mess.recipientHide}
                  senderHide={mess.senderHide}
                  setMessage={setMessage}
                  messageArray={message}
                  allowScroll={allowScroll}
                  setAllowScroll={setAllowScroll}
                  setReplyMessage={setReplyMessage}
                  setReplyTo={setReplyTo}
                  setIsReply={setIsReply}
                  setReplyID={setReplyID}
                  setReplyType={setReplyType}
                /> : imageExtension.some((ext) => !Array.isArray(mess) ? ext === mess.extension.toLowerCase() : ext === mess[0].extension.toLowerCase()) ?
                  <MessageImage key={Math.random() * (9999999999 - 0)}
                    ID={Array.isArray(mess) ? mess[0].ID : mess.ID}
                    senderID={mess.sender}
                    messageArray={message}
                    setMessage={setMessage}
                    timestamp={Array.isArray(mess) ? mess[0].timestamp : mess.timestamp}
                    sender={Array.isArray(mess) ? parseInt(mess[0].sender) === user.ID : parseInt(mess.sender) === user.ID}
                    senderHide={Array.isArray(mess) ? mess[0].senderHide : mess.senderHide}
                    recipientHide={Array.isArray(mess) ? mess[0].recipientHide : mess.recipientHide}
                    isArray={Array.isArray(mess)}
                    setAllowScroll={setAllowScroll}
                    setReplyMessage={setReplyMessage}
                    setReplyTo={setReplyTo}
                    setIsReply={setIsReply}
                    setReplyID={setReplyID}
                    setReplyType={setReplyType}
                    uuid={Array.isArray(mess) ? mess[0].uuid : mess.uuid}
                    src={mess}
                  />
                  :
                  videoExtension.some((ext) => !Array.isArray(mess) ? ext === mess.extension.toLowerCase() : ext === mess[0].extension.toLowerCase()) || mess.type === "youtube" ?
                    <Video url={mess.file} ID={Array.isArray(mess) ? mess[0].ID : mess.ID}
                      key={mess.ID}
                      senderID={mess.sender}
                      messageArray={message}
                      setMessage={setMessage}
                      timestamp={Array.isArray(mess) ? mess[0].timestamp : mess.timestamp}
                      type={mess.type}
                      setAllowScroll={setAllowScroll}
                      setReplyMessage={setReplyMessage}
                      setReplyTo={setReplyTo}
                      setIsReply={setIsReply}
                      setReplyID={setReplyID}
                      setReplyType={setReplyType}
                      sender={Array.isArray(mess) ? parseInt(mess[0].sender) === user.ID : parseInt(mess.sender) === user.ID}
                      senderHide={Array.isArray(mess) ? mess[0].senderHide : mess.senderHide}
                      recipientHide={Array.isArray(mess) ? mess[0].recipientHide : mess.recipientHide}
                      uuid={Array.isArray(mess) ? mess[0].uuid : mess.uuid}></Video>
                    :
                    audioExtension.some((ext) => !Array.isArray(mess) ? ext === mess.extension.toLowerCase() : ext === mess[0].extension.toLowerCase()) ?
                      <Audio recipientHide={mess.recipientHide}
                        uuid={mess.uuid}
                        ID={mess.ID}
                        senderID={mess.sender}
                        messageArray={message}
                        setMessage={setMessage}
                        setAllowScroll={setAllowScroll}
                        setReplyMessage={setReplyMessage}
                        setReplyTo={setReplyTo}
                        setIsReply={setIsReply}
                        setReplyID={setReplyID}
                        setReplyType={setReplyType}
                        senderHide={mess.senderHide}
                        sender={parseInt(mess.sender) === user.ID}
                        key={Math.random() * (9999999999 - 0)}
                        src={mess.file}
                      ></Audio>
                      :
                      <MessageFile recipientHide={mess.recipientHide}
                        ID={mess.ID}
                        senderID={mess.sender}
                        messageArray={message}
                        setMessage={setMessage}
                        setAllowScroll={setAllowScroll}
                        setReplyMessage={setReplyMessage}
                        setReplyTo={setReplyTo}
                        setIsReply={setIsReply}
                        setReplyID={setReplyID}
                        setReplyType={setReplyType}
                        senderHide={mess.senderHide} sender={parseInt(mess.sender) === user.ID} filename={mess.filename} key={Math.random() * (9999999999 - 0)} size={convertFileSize(mess.size)} mimetype={mess.mimetype} name={mess.originalname} type={mess.extension} />
            );
          })}
        </div>
      </div>
    </>
  );
}