import ReactPlayer from 'react-player';
import Socket from './Socket'
import Cookies from 'js-cookie'
import "../Style/Video.css"

export function VideoSender(props) {
    function blurVideo() {

    }

    function deleteVideo() {
        const updatedMessage = props.message.filter((message) => message.id !== props.id);
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
    return (<>
        <div className="videoContainer sender">
            <div className="options">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="optionsSelection sender" style={{ height: 0 }}>
                    <div className="option">Blur this video</div>
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
            }} className="video sender" url={props.url} controls muted />
        </div>
    </>
    )
}

export function VideoRecipient(props) {
    return (
        <div className="videoContainer recipient">
            <div className="options">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="optionsSelection recipient" style={{ height: 0 }}>
                    <div className="option">Blur this video</div>
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