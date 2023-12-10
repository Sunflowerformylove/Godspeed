import { forwardRef } from "react";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";
import "../Style/CallResponse.css";

export const CallResponse = forwardRef((props, ref) => {
    return (<>
        <div ref = {ref} className="modal show">
            <div className="callResponseContainer">
                <img src="https://placekitten.com/300/200" alt="" className="callerAvt avatar" />
                <div className="promptCallResponse">Incoming call from {props.callerName}
                    <div className="callAnim">
                        <div className="callDot"></div>
                        <div className="callDot"></div>
                        <div className="callDot"></div>
                    </div>
                </div>

                <div className="callResponseButtons">
                    <IonIcon className="stopCall" icon ={Icon.call}></IonIcon>
                    <IonIcon className="answerCall" icon ={Icon.call}></IonIcon>
                </div>
            </div>
        </div>
    </>)
});