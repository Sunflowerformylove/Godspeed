import ReactPlayer from 'react-player';
import "../Style/Video.css"

export function VideoSender(props) {
    function blurVideo(){

    }

    function deleteVideo(){
        const updatedMessage = props.message.forEach((mess) => {
            if(mess.ID === props.ID){
                mess.content = "This video has been deleted"
            }
        })
    }

    function saveVideo(){


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
            <ReactPlayer className="video sender" url={props.url} controls muted />
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
            <ReactPlayer className="video recipient" url={props.url} controls muted />
        </div>
    )
}