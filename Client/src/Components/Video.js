import ReactPlayer from 'react-player';
import Socket from './Socket'
import Cookies from 'js-cookie'
import "../Style/Video.css"
import userContext from './userData';
import { useContext } from 'react';

export function VideoSender(props) {
    const [user, setUser] = useContext(userContext);
    function deleteVideo() {
        const updatedMessage = props.messageArray.filter((message) => message.id !== props.id);
        props.setMessage(updatedMessage);
        Socket.emit("deleteSVideo", {
            ID: props.id,
            room: Cookies.get("currentRoom"),
            type: props.type,
            uuid: props.uuid,
        });
    }

    function saveVideo() {


    }

    function reply() {
        props.setReplyTo(props.sender ? user.user : user.receiverName);
        props.setReplyMessage(props.url);
        props.setIsReply(true);
        props.setReplyID(props.senderID);
        props.setReplyType("video");
    }

    return (<>
        <div className="videoContainer sender">
            <div className="options">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="optionsSelection sender" style={{ height: 0 }}>
                    <div className="option" onClick={reply}>Reply</div>
                    <div onClick={deleteVideo} className="option">Delete this video</div>
                    <div className="option">Save video</div>
                </div>
            </div>
            <ReactPlayer config={{
                file: {
                    attributes: {
                        crossOrigin: "anonymous",
                    }
                }
            }}
                playsinline={true}
                className="video sender" url={props.url} controls muted />
        </div>
    </>
    )
}

export function VideoRecipient(props) {
    const [user, setUser] = useContext(userContext);
    function reply() {
        props.setReplyTo(props.sender ? user.user : user.receiverName);
        props.setReplyMessage(props.url);
        props.setIsReply(true);
        props.setReplyID(props.senderID);
        props.setReplyType("video");
    }
    return (
        <div className="videoContainer recipient">
            <div className="options">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="optionsSelection recipient" style={{ height: 0 }}>
                    <div className="option" onClick={reply}>Reply</div>
                    <div className="option">Delete this video</div>
                    <div className="option">Save video</div>
                </div>
            </div>
            <ReactPlayer config={{
                file: {
                    attributes: {
                        crossOrigin: "anonymous",
                    }
                }
            }} className="video recipient" url={props.url} controls muted />
        </div>
    )
}