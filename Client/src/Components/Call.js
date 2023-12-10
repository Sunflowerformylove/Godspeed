import { forwardRef, useEffect, useRef, useState } from "react";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";
import { toastError } from "./Toast";
import Socket from "./Socket";
import Cookies from "js-cookie";
import "../Style/Call.css";

export const Call = forwardRef((props, ref) => {
    const vidReceiverRef = useRef(null);
    const vidSenderRef = useRef(null);
    const vidContainerRef = useRef(null);
    const [senderStream, setSenderStream] = useState(null);
    const [receiverStream, setReceiverStream] = useState(null);
    function goFullscreen() {
        if (vidReceiverRef.current.requestFullscreen) {
            vidReceiverRef.current.requestFullscreen();
        } else if (vidReceiverRef.current.webkitRequestFullscreen) {
            vidReceiverRef.current.webkitRequestFullscreen();
        } else if (vidReceiverRef.current.mozRequestFullScreen) {
            vidReceiverRef.current.mozRequestFullScreen();
        } else if (vidReceiverRef.current.msRequestFullscreen) {
            vidReceiverRef.current.msRequestFullscreen();
        }
        else{
            toastError("Fullscreen not supported on this device!");
        }
    }
    function goPIP() {
        if (vidReceiverRef.current === null || vidReceiverRef.current.src === "" || vidReceiverRef.current.src === undefined || vidReceiverRef.current.metaData === undefined) {
            toastError("Call not started yet or video source is not loaded!");
            return;
        }
        else if (vidReceiverRef.current.requestPictureInPicture) {
            vidReceiverRef.current.requestPictureInPicture();
        }
    }

    function toggleTheater() {
        if (vidContainerRef.current.classList.contains("theater")) {
            vidContainerRef.current.classList.remove("theater");
        }
        else {
            vidContainerRef.current.classList.add("theater");
        }
    }

    Socket.emit("call", {
        sender: props.sender,
        receiver: props.receiver,
        room: Cookies.get("currentRoom")
    })

    Socket.on("call", (data) => {
        if(vidReceiverRef && data.receiver === )
    })

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            vidSenderRef.current.srcObject = stream;
            vidSenderRef.current.play();
            setSenderStream(stream);
        }).catch((err) => {
            toastError(err.message);
        });
    }, []);

    return (<>
        <div className="modal show" ref={ref}>
            <div className="callContainer">
                <div ref={vidContainerRef} className="vidContainer theater">
                    <video ref={vidReceiverRef} src=
                        ""
                        className="callVid"></video>
                    <div className="videoIcons">
                        <i onClick={goFullscreen} className='bx bx-fullscreen fullscreenIcon vidIcon'></i>
                        <span onClick={goPIP} className="material-icons pipIcon vidIcon">
                            picture_in_picture_alt
                        </span>
                        <span onClick={toggleTheater} className="material-icons theaterIcon vidIcon">
                            crop_16_9
                        </span>
                    </div>
                </div>
                <div className="callerVidContainer">
                    <video ref ={vidSenderRef} className="callerVid"></video>
                </div>
                <div className="sensor"></div>
                <div className="callOptions">
                    <IonIcon icon={Icon.micOffOutline} className="callOption" />
                    <IonIcon icon={Icon.callOutline} className="callOption" />
                    <IonIcon icon={Icon.videocamOffOutline} className="callOption" />
                    <IonIcon icon={Icon.volumeMuteOutline} className="callOption" />
                    <IonIcon icon={Icon.chatboxEllipsesOutline} className="callOption" />
                    <IonIcon icon={Icon.arrowDownOutline} className="callOption" />
                </div>
            </div>
        </div>
    </>)
});