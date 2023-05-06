import "../Style/Chat.css";
import Socket from "./Socket";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { toastError, toastSuccess } from "./Toast";
import axios from "axios";
// import { Swiper, SwiperSlide } from 'swiper/react';

export function MessageRecipient(props) {
  const [allowDownload, setAllowDownload] = useState(false);
  function deleteFunction() {
    props.setAllowScroll(false);
    props.setMessage(props.messageArray.filter((mess) => mess.ID !== props.ID));
    Socket.emit("deleteRMessage", {
      ID: props.ID,
      room: Cookies.get("currentRoom"),
    });
    toastSuccess("Message hidden");
  }
  function copyFunction() {
    navigator.clipboard.writeText(props.message);
    toastSuccess("Copied to clipboard");
  }
  return (
    <>
      <div className="message">
        <div className="bubble recipient">{props.message}</div>
        <div className="options">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="optionsSelection recipient" style={{ height: 0 }}>
            <div className="option eraseMessage" onClick={deleteFunction}>
              Erase this message
            </div>
            <div className="option copyMessage" onClick={copyFunction}>Copy this message</div>
          </div>
        </div>
      </div>
    </>
  );
}

export function MessageSender(props) {
  function deleteFunction() {
    props.setAllowScroll(false);
    const updateMessage = props.messageArray.map((message) => {
      if (message.ID === props.ID) {
        return {
          ...message,
          senderHide: true,
          content: "",
        };
      }
      return {
        ...message,
      };
    });
    props.setMessage(updateMessage);
    Socket.emit("deleteSMessage", {
      ID: props.ID,
      room: Cookies.get("currentRoom"),
    });
    toastSuccess("Message deleted");
  }
  function copyFunction() {
    navigator.clipboard.writeText(props.message);
    toastSuccess("Copied to clipboard");
  }
  return (
    <>
      <div className="message sender">
        <div className="bubble sender">{props.message}</div>
        <div className="options sender">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="optionsSelection sender" style={{ height: 0 }}>
            <div className="option eraseMessage" onClick={deleteFunction}>
              Erase this message
            </div>
            <div className="option copyMessage" onClick={copyFunction}>Copy this message</div>
          </div>
        </div>
      </div>
    </>
  );
}

export function MessageDeletedSender() {
  return (
    <>
      <div className="message">
        <div className="bubble deleted sender">You unsent this message.</div>
      </div>
    </>
  );
}

export function MessageDeletedRecipient() {
  return (
    <>
      <div className="message">
        <div className="bubble deleted recipient">This message was unsent.</div>
      </div>
    </>
  );
}

export default function Message(props) {
  if (props.sender && !props.senderHide) {
    return (
      <MessageSender
        allowScroll={props.allowScroll}
        setAllowScroll={props.setAllowScroll}
        ID={props.ID}
        message={props.message}
        setMessage={props.setMessage}
        messageArray={props.messageArray}
      />
    );
  } else if (!props.sender && !props.recipientHide && !props.senderHide) {
    return (
      <MessageRecipient
        allowScroll={props.allowScroll}
        setAllowScroll={props.setAllowScroll}
        ID={props.ID}
        message={props.message}
        setMessage={props.setMessage}
        messageArray={props.messageArray}
      />
    );
  } else if (props.sender && props.senderHide) {
    return <MessageDeletedSender />;
  } else if (!props.sender && props.senderHide) {
    return <MessageDeletedRecipient />;
  }
}

export function MessageImageSender(props) {
  function deleteImage(){
    const updateMessage = props.messageArray.map((message)=>{
      if(Array.isArray(message) && message[0].ID === props.ID){
        return message.map((mess)=>{
          return {
            ...mess,
            senderHide: true,
            content: "",
          }
        })
      }
      else if(!Array.isArray(message) && message.ID === props.ID){
        return {
          ...message,
          senderHide: true,
          content: "",
        }
      }
      return message;
    });
    props.setMessage(updateMessage);
    Socket.emit("deleteSImage", {
      ID: props.ID,
      room: Cookies.get("currentRoom"),
      timestamp: props.timestamp,
      
    });
  }
  return (<>
    <div className="imageWrap sender">
      <div className="imageOptions sender">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="imageOptionSelection sender" style={{ height: 0 }}>
          <div className="imageOption deleteImage" onClick={deleteImage}>Delete image(s)</div>
          <div className="imageOption"></div>
        </div>
      </div>
      <div className="imageContainer" style={{ gridTemplateColumns: `repeat(${Math.min(props.src.length, 3)},auto)` }}>
        {props.isArray ? props.src.map((src) => {
          return (<img key = {Math.random() * (99999999999 - 0)} alt="" className="image" src={src.file} />)
        }) : (<img key = {Math.random() * (99999999999 - 0)} alt="" className="image" src={props.src.file} />)}
      </div>
    </div>
  </>)
}

export function MessageImageRecipient(props) {
  return (<>
    <div className="imageWrap recipient">
      <div className="imageContainer recipient" style={{ gridTemplateColumns: `repeat(${Math.min(props.src.length, 3)},auto)` }}>
        {props.isArray ? props.src.map((src) => {
          return (<img alt="" className="image" src={src.file} />)
        }) : (<img alt="" className="image" src={props.src.file} />)}
      </div>
    </div>
  </>)
}

export function MessageImage(props) {
  if (props.sender && !props.senderHide) {
    return (
      <MessageImageSender
        key={Math.random() * (9999999999 - 0)}
        isArray={props.isArray}
        src={props.src}
        messageArray={props.messageArray}
        setMessage={props.setMessage}
        ID={props.ID}
      />
    );
  } else if (!props.sender && !props.recipientHide && !props.senderHide) {
    return (
      <MessageImageRecipient
        key={Math.random() * (9999999999 - 0)}
        isArray={props.isArray}
        src={props.src}
      />
    );
  } else if (props.sender && props.senderHide) {
    return <MessageDeletedSender />;
  } else if (!props.sender && props.senderHide) {
    return <MessageDeletedRecipient />;
  }
}

function setFileIcon(props) {
  const fileType = props.type;
  let fileIcon = <i className="fa-solid fa-file fileIcon generalIcon"></i>;
  if (fileType === ".pdf") {
    fileIcon = <i className="fa-solid fa-file-pdf fileIcon pdfIcon"></i>
  }
  else if (fileType === ".docx" || fileType === ".doc") {
    fileIcon = <i className="fa-solid fa-file-word fileIcon docIcon"></i>
  }
  else if (fileType === ".pptx" || fileType === ".ppt") {
    fileIcon = <i className="fa-solid fa-file-powerpoint fileIcon pptIcon"></i>
  }
  else if (fileType === ".xlsx" || fileType === ".xls") {
    fileIcon = <i className="fa-solid fa-file-excel fileIcon excelIcon"></i>
  }
  else if (fileType === ".txt") {
    fileIcon = <i className="fa-solid fa-file-lines"></i>
  }
  else if (fileType === ".zip" || fileType === ".rar") {
    fileIcon = <i className="fa-solid fa-file-zip fileIcon zipIcon"></i>
  }
  else if (fileType === ".cpp") {
    fileIcon = <svg className="svgIcon cppIcon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>C++</title><path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.11-7.11a7.133 7.133 0 016.156 3.553l-3.076 1.78a3.567 3.567 0 00-3.08-1.78A3.56 3.56 0 008.444 12 3.56 3.56 0 0012 15.555a3.57 3.57 0 003.08-1.778l3.078 1.78A7.135 7.135 0 0112 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79z" /></svg>
  }
  else if (fileType === ".js") {
    fileIcon = <i className="fa-brands fa-square-js jsIcon fileIcon"></i>;
  }
  else if (fileType === ".c") {
    fileIcon = <svg className="svgIcon cIcon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>C</title><path d="M16.5921 9.1962s-.354-3.298-3.627-3.39c-3.2741-.09-4.9552 2.474-4.9552 6.14 0 3.6651 1.858 6.5972 5.0451 6.5972 3.184 0 3.5381-3.665 3.5381-3.665l6.1041.365s.36 3.31-2.196 5.836c-2.552 2.5241-5.6901 2.9371-7.8762 2.9201-2.19-.017-5.2261.034-8.1602-2.97-2.938-3.0101-3.436-5.9302-3.436-8.8002 0-2.8701.556-6.6702 4.047-9.5502C7.444.72 9.849 0 12.254 0c10.0422 0 10.7172 9.2602 10.7172 9.2602z" /></svg>
  }
  else if (fileType === ".css") {
    fileIcon = <svg className="svgIcon cssIcon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>CSS3</title><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" /></svg>
  }
  else if (fileType === ".html") {
    fileIcon = <svg className="svgIcon htmlIcon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>HTML5</title><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" /></svg>
  }
  else if (fileType === ".java") {
    fileIcon = <i className="fa-brands fa-java fileIcon javaIcon"></i>
  }
  else if (fileType === ".rb") {
    fileIcon = <svg className="svgIcon rubyIcon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Ruby</title><path d="M20.156.083c3.033.525 3.893 2.598 3.829 4.77L24 4.822 22.635 22.71 4.89 23.926h.016C3.433 23.864.15 23.729 0 19.139l1.645-3 2.819 6.586.503 1.172 2.805-9.144-.03.007.016-.03 9.255 2.956-1.396-5.431-.99-3.9 8.82-.569-.615-.51L16.5 2.114 20.159.073l-.003.01zM0 19.089zM5.13 5.073c3.561-3.533 8.157-5.621 9.922-3.84 1.762 1.777-.105 6.105-3.673 9.636-3.563 3.532-8.103 5.734-9.864 3.957-1.766-1.777.045-6.217 3.612-9.75l.003-.003z" /></svg>
  }
  else if (fileType === ".sass") {
    fileIcon = <svg className="svgIcon sassIcon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Sass</title><path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zM9.615 15.998c.175.645.156 1.248-.024 1.792l-.065.18c-.024.061-.052.12-.078.176-.14.29-.326.56-.555.81-.698.759-1.672 1.047-2.09.805-.45-.262-.226-1.335.584-2.19.871-.918 2.12-1.509 2.12-1.509v-.003l.108-.061zm9.911-10.861c-.542-2.133-4.077-2.834-7.422-1.645-1.989.707-4.144 1.818-5.693 3.267C4.568 8.48 4.275 9.98 4.396 10.607c.427 2.211 3.457 3.657 4.703 4.73v.006c-.367.18-3.056 1.529-3.686 2.925-.675 1.47.105 2.521.615 2.655 1.575.436 3.195-.36 4.065-1.649.84-1.261.766-2.881.404-3.676.496-.135 1.08-.195 1.83-.104 2.101.24 2.521 1.56 2.43 2.1-.09.539-.523.854-.674.944-.15.091-.195.12-.181.181.015.09.091.09.21.075.165-.03 1.096-.45 1.141-1.471.045-1.29-1.186-2.729-3.375-2.7-.9.016-1.471.091-1.875.256-.03-.045-.061-.075-.105-.105-1.35-1.455-3.855-2.475-3.75-4.41.03-.705.285-2.564 4.8-4.814 3.705-1.846 6.661-1.335 7.171-.21.733 1.604-1.576 4.59-5.431 5.024-1.47.165-2.235-.404-2.431-.615-.209-.225-.239-.24-.314-.194-.12.06-.045.255 0 .375.12.3.585.825 1.396 1.095.704.225 2.43.359 4.5-.45 2.324-.899 4.139-3.405 3.614-5.505l.073.067z" /></svg>
  }
  else if (fileType === ".py") {
    fileIcon = <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Python</title><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" /></svg>
  }
  return fileIcon;
}

export function MessageFileSender(props) {
  async function downloadFile() {
    const formData = {
      filename: props.filename,
      mimetype: props.mimetype
    };
    await axios.post('https://localhost:3000/api/download', formData,
      { responseType: 'blob' })
      .then((res) => { return res.data })
      .then((data) => {
        let blob = new Blob([data], { type: props.mimetype });
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', props.name);
        link.click();
      })
  }


  return (<>
    <div className="fileContainer sender" onClick={downloadFile}>
      {setFileIcon(props)}
      <div className="fileData">
        <div className="fileName">{props.name}</div>
        <div className="fileSize">{props.size}</div>
      </div>
    </div>
  </>)
}

export function MessageFileRecipient(props) {
  async function downloadFile() {
    const formData = {
      filename: props.filename,
      mimetype: props.mimetype
    };
    await axios.post('https://localhost:3000/api/download', formData,
      { responseType: 'blob' })
      .then((res) => { return res.data })
      .then((data) => {
        let blob = new Blob([data], { type: props.mimetype });
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', props.name);
        link.click();
      })
  }


  return (<>
    <div className="fileContainer recipient" onClick={downloadFile}>
      {setFileIcon(props)}
      <div className="fileData">
        <div className="fileName">{props.name}</div>
        <div className="fileSize">{props.size}</div>
      </div>
    </div>
  </>)
}

export function MessageFile(props) {
  if (props.sender && !props.senderHide) {
    return (
      <MessageFileSender
        key={Math.random() * (9999999999 - 0)}
        filename={props.filename}
        size={props.size}
        mimetype={props.mimetype}
        name={props.name}
        type={props.type}
      />
    );
  } else if (!props.sender && !props.recipientHide && !props.senderHide) {
    return (
      <MessageFileRecipient
        key={Math.random() * (9999999999 - 0)}
        filename={props.filename}
        size={props.size}
        mimetype={props.mimetype}
        name={props.name}
        type={props.type}
      />
    );
  } else if (props.sender && props.senderHide) {
    return <MessageDeletedSender />;
  } else if (!props.sender && props.senderHide) {
    return <MessageDeletedRecipient />;
  }
}