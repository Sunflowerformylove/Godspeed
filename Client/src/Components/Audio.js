import "../Style/Chat.css"
import Socket from "./Socket";
import Cookies from "js-cookie";

export function MessageAudioSender(props) {
    function deleteFunction() {
        const updatedMessage = props.messageArray.map((message) => {
            if (message.uuid === props.uuid) {
                message.content = "deleted";
                message.senderHide = true;
                return message;
            }
            return message;
        })
        props.setMessage(updatedMessage);
        props.setAllowScroll(false);
        Socket.emit("deleteSAudio", {
            ID: props.id,
            room: Cookies.get("currentRoom"),
            type: props.type,
            uuid: props.uuid,
            filename: props.filename,
            originalname: props.originalname,
            location: props.location,
        });
    }
    return (<>
        <div className="audioContainer sender">
            <div className="options sender">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="optionsSelection sender" style={{ height: 0 }}>
                    <div className="option eraseMessage" onClick={deleteFunction}>
                        Retrieve this audio
                    </div>
                    <div className="option copyMessage">Report for violation</div>
                </div>
            </div>
            <audio src={props.src} controls className="audio"></audio>
        </div>
    </>)
}

export function MessageAudioRecipient(props) {
    function deleteFunction() {
        const updatedMessage = props.messageArray.map((message) => {
            if (message.uuid === props.uuid) {
                message.recipientHide = true;
                return message;
            }
            return message;
        })
        props.setMessage(updatedMessage);
        props.setAllowScroll(false);
        Socket.emit("deleteRAudio", {
            ID: props.id,
            room: Cookies.get("currentRoom"),
            type: props.type,
            uuid: props.uuid,
            filename: props.filename,
            originalname: props.originalname,
            location: props.location,
        });
    }
    return (<>
        <div className="audioContainer recipient">
            <audio src={props.src} controls className="audio"></audio>
            <div className="options recipient">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="optionsSelection recipient" style={{ height: 0 }}>
                    <div className="option eraseMessage" onClick={deleteFunction}>
                        Hide this audio
                    </div>
                    <div className="option copyMessage">Report for violation</div>
                </div>
            </div>
        </div>
    </>)
}