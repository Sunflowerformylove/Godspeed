import Socket from "./Socket";
import Cookies from "js-cookie";
import { toastSuccess } from "./Toast";

export function MessageImageRecipient(props) {
    function deleteImage() {
        console.log(props.ID)
        const updateMessage = props.messageArray.map((message) => {
            if (Array.isArray(message) && message[0].ID === props.ID) {
                console.log(message[0].ID);
                return message.map((mess) => {
                    return {
                        ...mess,
                        recipientHide: true,
                    }
                })
            }
            else if (!Array.isArray(message) && message.ID === props.ID) {
                console.log(message.ID);
                return {
                    ...message,
                    recipientHide: true,
                }
            }
            return message;
        });
        props.setMessage(updateMessage);
        Socket.emit("deleteRImage", {
            ID: props.ID,
            room: Cookies.get("currentRoom"),
            timestamp: props.timestamp,
            uuid: props.uuid,
        });
        toastSuccess("Image(s) hidden");
    }
    return (<>
        <div className="imageWrap recipient">
            <div className="imageContainer recipient" style={{ gridTemplateColumns: `repeat(${Math.min(props.src.length, 3)},auto)` }}>
                {props.isArray ? props.src.map((src) => {
                    return (<img alt="" className="image" src={src.file} />)
                }) : (<img alt="" className="image" src={props.src.file} />)}
            </div>
            <div className="imageOptions recipient">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="imageOptionSelection recipient" style={{ height: 0 }}>
                    <div className="imageOption deleteImage" onClick={deleteImage}>Delete image(s)</div>
                    <div className="imageOption"></div>
                </div>
            </div>
        </div>
    </>)
}

export function MessageImageSender(props) {
    function deleteImage() {
        const updateMessage = props.messageArray.map((message) => {
            if (Array.isArray(message) && message[0].ID === props.ID) {
                return message.map((mess) => {
                    return {
                        ...mess,
                        senderHide: true,
                        content: "",
                    }
                })
            }
            else if (!Array.isArray(message) && message.ID === props.ID) {
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
            uuid: props.uuid,
        });
        toastSuccess("Image(s) deleted");
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
                    return (<img key={Math.random() * (99999999999 - 0)} alt="" className="image" src={src.file} />)
                }) : (<img key={Math.random() * (99999999999 - 0)} alt="" className="image" src={props.src.file} />)}
            </div>
        </div>
    </>)
}