import { useRef, useState, forwardRef } from "react";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";
import "../Style/Dialing.css";

export const Dialing = forwardRef((props, ref) => {
    const [videoCamIcon, setVideoCamIcon] = useState(Icon.videocam);
    const [micIcon, setMicIcon] = useState(Icon.mic);

    function toggleVideoCam() {
        if (videoCamIcon === Icon.videocam) {
            setVideoCamIcon(Icon.videocamOff);
        } else {
            setVideoCamIcon(Icon.videocam);
        }
    }

    function toggleMic() {
        if (micIcon === Icon.mic) {
            setMicIcon(Icon.micOff);
        } else {
            setMicIcon(Icon.mic);
        }
    }

    return (<>
        <div ref = {ref} className="modal">
            <div className="dialingContainer">
                <img src="https://placekitten.com/300/200" alt="" className="calleeAvt avatar" />
                <div className="promptDialing">Calling {props.calleeName}
                    <div className="callAnim">
                        <div className="callDot"></div>
                        <div className="callDot"></div>
                        <div className="callDot"></div>
                    </div>
                </div>

                <div className="dialingButtons">
                    <IonIcon className="stopCall" icon ={Icon.call}></IonIcon>
                    <IonIcon onClick={toggleVideoCam} className="camToggleIcon" icon ={videoCamIcon}></IonIcon>
                    <IonIcon onClick={toggleMic} className="micToggleIcon" icon ={micIcon}></IonIcon>
                </div>
            </div>
        </div>
    </>)
})