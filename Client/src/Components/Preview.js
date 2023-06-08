import "../Style/Preview.css";
import { IonIcon } from "@ionic/react";
import { useState } from "react";
import * as Icon from "ionicons/icons";

export function ImagePreview(props) {
  return (
    <>
      <div className="previewImageContainer">
        <IonIcon icon={Icon.close} className="removePreview"></IonIcon>
        <img src={props.url} alt="preview" className="previewImage" />
      </div>
    </>
  );
}

export function FilePreview(props) {
  const [type, setType] = useState("");
  
  return (<>
    <div className="previewFileContainer">
      <IonIcon icon={Icon.close} className="removePreview"></IonIcon>
      <div className="fileInfo">
        <div className="fileIcon">
        </div>
        <div className="fileName">
          {props.name}
        </div>
        <div className="fileSize"></div>
      </div>
    </div>
  </>)
}

export function VideoPreview(props) {
  return (<>
    <div className="previewVideoContainer">
      <IonIcon icon={Icon.close} className="removePreview"></IonIcon>
      <video src={props.src} className="previewVideo"></video>
      <div className="preventPlayModal"></div>
      <IonIcon icon={Icon.playOutline} className="playIcon"></IonIcon>
    </div>
  </>)
}