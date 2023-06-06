import Socket from "./Socket";
import { useState, useEffect, useContext } from "react";
import { IonIcon } from "@ionic/react";
import userContext from "./userData";
import * as Icon from "ionicons/icons";
import "../Style/ChatHeader.css";

export default function ChatHeader(props) {
    const [status, setStatus] = useState(true);
    const [user, setUser] = useContext(userContext);
    useEffect(() => {
        Socket.emit("checkStatus", { receiver: user.receiver });
    }, [user.receiver]);
    return (<>
        <div className="chatHeader">
            <div className="leftSection">
                <img src={props.src} alt="" className="recipientAvatar" />
                <div className="recipientInfo">
                    <div className="recipientName">{user.receiverName}</div>
                    <div className="recipientStatusContainer">
                        {status
                            ?
                            <div className="recipientStatus online">
                                <IonIcon icon={Icon.sunny} className="sunIcon"/>
                                <div className="statusText">Online</div>
                            </div>
                            :
                            <div className="recipientStatus offline">
                                <IonIcon icon={Icon.moonSharp} className = "moonIcon"/>
                                <div className="statusText">Offline</div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="rightSection">
                    <IonIcon icon = {Icon.videocam} className="videoChat chatIcon"></IonIcon>
                    <IonIcon icon = {Icon.call} className = "callChat chatIcon"></IonIcon>
            </div>
        </div>
    </>)
}