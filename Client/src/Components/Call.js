import "../Style/Call.css";
import Draggable from "react-draggable";
import { useContext, useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import userContext from "./userData";
import Socket from "./Socket";
import Cookies from "js-cookie";
import { toastError } from "./Toast";

export default function Call(props) {
    const vidSenderRef = useRef(null);
    const vidReceiverRef = useRef(null);
    const containerRef = useRef(null);
    const [user, setUser] = useContext(userContext);
    const [me, setMe] = useState(null);
    const [stream, setStream] = useState(null);
    const [isCalling, setIsCalling] = useState(false);

    async function askUserMedia() {
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                }, audio: false
            })
        }
        catch (err) {
            if (err.message === "Device in use") {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.label.includes("OBS"));
                const video = videoDevices[0].deviceId;
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: {
                            exact: video
                        },
                        facingMode: "user",
                    }, audio: false
                })
            }
            else {
                toastError("Error" + err.message)
            }
        }
        setStream(stream);
        vidSenderRef.current.srcObject = stream;
    }

    function assignPeer() {
        const peer = new Peer({
            host: "localhost",
            port: 9000,
            path: "/",
            secure: true,
            // debug: 3,
            config: {
                'iceServers': [
                    { url: 'stun:stun01.sipphone.com' },
                    {
                        url: 'turn:192.158.29.39:3478?transport=tcp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    },
                    {
                        url: 'turn:turn.bistri.com:80',
                        credential: 'homeo',
                        username: 'homeo'
                    },
                ]
            },
        })
        return peer;
    }

    async function callUser(ID) {
        const call = me.call(ID, stream);
        call.on("stream", (userVideoStream) => {
            vidReceiverRef.current.srcObject = userVideoStream;
            console.log(userVideoStream.getVideoTracks()[0].getCapabilities());
            vidReceiverRef.current.play()
        });
        setIsCalling(true);
    }

    async function answerCall() {
        me.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (userVideoStream) => {
                vidReceiverRef.current.srcObject = userVideoStream;
                // vidReceiverRef.current.play();
            });
        });
        setIsCalling(true);
    }

    useEffect(() => {
        Cookies.set("currentRoom", "00ewRc");
        Socket.emit("join", {
            sender: user.ID,
            receiver: user.ID === 1 ? 2 : 1,
        });
        askUserMedia();
        setMe(assignPeer());
    }, []);

    useEffect(() => {
        // caller side
        if (!me || !stream) return;
        if (props.caller === user.ID) {
            Socket.emit("handshake",
                {
                    caller: user.ID,
                    callee: props.callee,
                    isCallerHandshake: true,
                    room: Cookies.get("currentRoom")
                });
        }

        // callee side
        if (props.callee === user.ID && !isCalling) {
            answerCall();
        }

        Socket.on("handshake", (data) => {
            if (data.isCallerHandshake && data.callee === user.ID) {
                Socket.emit("handshake", {
                    caller: data.caller,
                    callee: user.ID,
                    isCalleeHandshake: true,
                    ID: me.id,
                    room: Cookies.get("currentRoom")
                })
            }
            else if (data.isCalleeHandshake && data.caller === user.ID && !isCalling) {
                callUser(data.ID);
            }
        })
    }, [me, stream]);

    useEffect(() => {
        vidReceiverRef.current.play();
    }, [])

    return (<>
        <div ref={containerRef} className="callContainer">
            <video ref={vidReceiverRef} muted playsInline autoPlay className="vidReceiver"></video>
            <Draggable
                bounds="parent"
            >
                <video preload={"none"} ref={vidSenderRef} muted playsInline autoPlay className="vidSender"></video>
            </Draggable>
        </div>
    </>)
}