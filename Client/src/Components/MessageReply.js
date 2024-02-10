import { useState, useContext } from "react";
import "../Style/MessageReply.css";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";
import userContext from "./userData"

export default function MessageReply(props) {
    const [user, setUser] = useContext(userContext);
    const [announce, setAnnounce] = useState("");
    function typeOfAnnounce(props) {
        if (props.replier === user.user) { // if the replier is the user
            if (props.reply === user.receiver) {
                setAnnounce(`You have reply to ${props.replyName}`);
            }
            else if (props.reply === user.user) {
                setAnnounce(`You have reply to yourself`);
            }
        }
        else if (props.replier === user.receiver) { // if the replier is the user
            if (props.reply === user.user) {
                setAnnounce(`${props.replyName} has reply to you`);
            }
            else if (props.reply === user.receiver) {
                setAnnounce(`${props.replyName} has reply to themselves`);
            }
        }
    }
    return (<>{ props.isReply ? 
        <div className={`repContainer ${props.sender ? "sender" : "receiver"}`}>
            <div className="repAnnounce">{announce}</div>
            {props.replyMessageType === "text"
                ? <div className="repText">{props.replyMessage}</div> : props.replyMessageType === "image" ?
                    <img src="/logo192.png" alt="" className="repImage" />
                    : props.replyMessageType === "audio" ?
                        <audio controls src="/teams.mp3" className="repAudio"></audio> :
                        props.replyMessageType === "file" ? <div className="repFile">
                            <div className="repFileName">Lorem.txt</div>
                            <div className="repFileSize">12KB</div>
                        </div> : props.replyMessageType === "youtube" ? <div className="repYoutube">
                            <IonIcon icon={Icon.logoYoutube} className="youtubeIcon"></IonIcon>
                            <div className="youtubeUrl">https://www.youtube.com/shorts/Vd_8rQyzBSY</div>
                        </div>
                            : null
            }
        </div> : null
    }
    </>)
}