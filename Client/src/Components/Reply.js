import "../Style/Reply.css"
import { IonIcon } from "@ionic/react"
import * as Icon from "ionicons/icons"
import { useEffect, useContext, forwardRef } from "react";
import userContext from "./userData";

const Reply = forwardRef((props, replyRef) => {
    const [user, setUser] = useContext(userContext);
    function closeReply() {
        props.setIsReply(false);
        props.setReplyMessage("");
        props.setReplyTo("");
        props.setReplyID(-1);
        props.setReplyType("");
    }
    useEffect(() => {
        if (props.isReply) {
            replyRef.current.style.display = "flex";
        } else {
            replyRef.current.style.display = "none";
        }
    }, [props.isReply]);
    useEffect(() => {
        if(props.replyType === "video" || props.replyType === "image"){
            replyRef.current.classList.add("media");
        }
        else if(props.replyType === "audio"){
            replyRef.current.classList.add("audio");
        }
    }, [props.replyType])
    return (<>
        <div ref={replyRef} className="replyBox">
            <div className="replyTo">Replying to {props.replyTo === user.user ? "yourself" : props.replyTo}</div>
            <IonIcon icon={Icon.close} className="closeReply" onClick={closeReply}></IonIcon>
            {props.replyType === "text" ? <div className="replyMessage">{props.replyMessage}</div> :
                props.replyType === "image" ? <div alt="" className="replyImages" style={{ gridTemplateColumns: `repeat(${Math.min(props.replyMessage.length, 3)},auto)` }}>
                    {props.replyMessage.map((image, index) => {
                        return <img alt="" className="replyImg" src={image} key={index}></img>
                    })}
                </div> : props.replyType === "video" ?
                    <video src={props.replyMessage} className="replyVideo" muted autoPlay controls></video> :
                    props.replyType === "audio" ? <audio controls src={props.replyMessage}></audio> :
                        <div className="replyFile">
                            <IonIcon icon={Icon.document} className="replyFileIcon"></IonIcon>
                            <div className="replyFileName">{props.replyMessage}</div>
                            <div className="replyFileSize">{props.replySize}</div>
                        </div>}
        </div>
    </>)
});

export default Reply;