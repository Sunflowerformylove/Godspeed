import Peer from "peerjs";
import { toastError } from "./Toast.js";
import React, { useEffect, useRef, useState } from "react";

export default function VideoChat(props) {
    const [peer, setPeer] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);
    function requestMedia(mode) {
        if (mode === 0) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
                setMediaStream(stream);
            }).catch(err => {
                toastError(err);
            });
        }
        else if (mode === 0) {
            navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
                setMediaStream(stream);
            }).catch(err => {
                toastError(err);
            });
        }
    }
    
}