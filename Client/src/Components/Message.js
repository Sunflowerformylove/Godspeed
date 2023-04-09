import "../Style/Chat.css";
import Socket from "./Socket";
import Cookies from "js-cookie";
import {toastSuccess, toastError} from "./Toast";
// import { Swiper, SwiperSlide } from 'swiper/react';

export function MessageRecipient(props) {
  function deleteFunction() {
    props.setAllowScroll(false);
    props.setMessage(props.messageArray.filter((mess) => mess.ID !== props.ID));
    Socket.emit("deleteRMessage", {
      ID: props.ID,
      room: Cookies.get("currentRoom"),
    });
    toastSuccess("Message hidden");
  }
  function copyFunction(){
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
  function copyFunction(){
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
