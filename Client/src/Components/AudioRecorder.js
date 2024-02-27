import "../Style/Recorder.css";
import { useState, useEffect, useRef, forwardRef } from "react";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";
import { parse } from "@fortawesome/fontawesome-svg-core";

const AudioRecorder = forwardRef((props, ref) => {
    const [playIcon, setPlayIcon] = useState(Icon.pause);
    const [progress, setProgress] = useState(0); // 0 - 100
    const [duration, setDuration] = useState(0); // seconds 0 - 60
    const [time, setTime] = useState("0:00");
    function formatTime(time) {
        let seconds = time % 60;
        let minutes = Math.floor(time / 60);
        if (seconds < 10) {
            return `${minutes}:0${seconds}`;
        }
        else {
            return `${minutes}:${seconds}`;
        }
    }
    const progressRef = useRef(null);
    useEffect(() => {
        if (props.flag.timer === true) {
            setPlayIcon(Icon.pause);
            const interval = setInterval(() => {
                setProgress(prevProgress => prevProgress + 1 / 6);
                setDuration(prevDuration => prevDuration + 0.1);
            }, 100);
            if (progress !== 0 && progress !== 100) {
                progressRef.current.style.width = `${progress}%`;
            } else if (progress === 100) {
                progressRef.current.style.width = `0%`;
                setProgress(0);
                setTime("0:00");
                setDuration(0);
                props.flag.setTimer(false);
            }
            let tempTime = parseFloat(duration.toFixed(1));
            if (Number.isInteger(tempTime)) {
                setTime(formatTime(tempTime));
            }
            return () => clearInterval(interval);
        }
    }, [progress, duration, props]);

    return (
        <div ref={ref} className="recorderContainer">
            <div className="maxDuration"><div ref={progressRef} className="currentDuration"></div></div>
            <div className="recordingTime">{time}</div>
            <IonIcon icon={playIcon} className="pauseIcon" ></IonIcon>
            <IonIcon icon={Icon.refresh} className="restartIcon"></IonIcon>
        </div>
    )
})

export default AudioRecorder;