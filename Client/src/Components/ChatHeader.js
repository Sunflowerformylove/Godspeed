import Socket from "./Socket";
import { useState, useEffect, useContext } from "react";
import { IonIcon } from "@ionic/react";
import userContext from "./userData";
import * as Icon from "ionicons/icons";
import "../Style/ChatHeader.css";

export default function ChatHeader(props) {
    const [status, setStatus] = useState(false);
    const [user, setUser] = useContext(userContext);

    useEffect(() => {
        if (user.receiver) {
            Socket.emit("getStatus", user.receiver);
        }
        Socket.on("setStatus", (data) => {
            if (user.receiver !== undefined && data.ID === user.receiver) {
                setStatus(data.status);
            }
        })
    }, [user.receiver]);

    return (<>
        <div className={`chatHeader ${props.themeName}`}>
            <div className="leftSection">
                <img src={props.src} alt="" className="recipientAvatar" />
                <div className="recipientInfo">
                    <div className={`recipientName ${props.themeName}`}>{user.receiverName}</div>
                    <div className="recipientStatusContainer">
                        {status
                            ?
                            <div className="recipientStatus online">
                                <IonIcon icon={Icon.sunny} className="sunIcon" />
                                <div className="statusText">Online</div>
                            </div>
                            :
                            <div className="recipientStatus offline">
                                <IonIcon icon={Icon.moonSharp} className={`moonIcon ${props.themeName}`} />
                                <div className="statusText">Offline</div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="rightSection">
                <IonIcon icon={Icon.cogOutline} className={`chatSetting chatIcon ${props.themeName}`}></IonIcon>
                <IonIcon onClick={props.toggleModal} icon={Icon.videocam} className={`headerVideoChat chatIcon ${props.themeName}`}></IonIcon>
                <IonIcon icon={Icon.call} className={`headerCallChat chatIcon ${props.themeName}`}></IonIcon>
            </div>
        </div>
    </>)
}