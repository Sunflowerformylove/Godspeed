import "../Style/Chat.css";
import Socket from "./Socket";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { toastError, toastSuccess } from "./Toast";
import axios from "axios";
import { VideoSender, VideoRecipient } from "./Video";
import { MessageImageRecipient, MessageImageSender } from "./Image";
import { MessageFileRecipient, MessageFileSender } from "./File";
import { MessageAudioRecipient, MessageAudioSender } from "./Audio";
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
        timestamp={props.timestamp}
        uuid={props.uuid}
      />
    );
  } else if (!props.sender && !props.recipientHide && !props.senderHide) {
    return (
      <MessageImageRecipient
        key={Math.random() * (9999999999 - 0)}
        isArray={props.isArray}
        src={props.src}
        ID={props.ID}
        messageArray={props.messageArray}
        setMessage={props.setMessage}
        timestamp={props.timestamp}
        uuid={props.uuid}
      />
    );
  } else if (props.sender && props.senderHide) {
    return <MessageDeletedSender />;
  } else if (!props.sender && props.senderHide) {
    return <MessageDeletedRecipient />;
  }
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

export function Video(props) {
  if (props.sender && !props.senderHide) {
    return (
      <VideoSender url={props.url} />
    );
  } else if (!props.sender && !props.recipientHide && !props.senderHide) {
    return (
      <VideoRecipient url={props.url} />
    );
  } else if (props.sender && props.senderHide) {
    return <MessageDeletedSender />;
  } else if (!props.sender && props.senderHide) {
    return <MessageDeletedRecipient />;
  }
}