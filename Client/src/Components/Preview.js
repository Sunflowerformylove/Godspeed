import "../Style/Preview.css";
import { useRef } from "react";
import { setFileIcon } from "./File";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";

export function ImagePreview(props) {
  function removePreview() {
    const index = props.fileArr.findIndex((file) => file.name === props.name);
    props.fileArr.splice(index, 1);
    props.setFileArr([...props.fileArr]);
    const customIndex = props.customFilesArr.findIndex((file) => file.name === props.name);
    props.customFilesArr.splice(customIndex, 1);
    props.setCustomFilesArr([...props.customFilesArr]);
  }

  return (
    <>
      <div className="previewImageContainer">
        <IonIcon icon={Icon.close} onClick = {removePreview} className="removePreview"></IonIcon>
        <img src={props.url} alt="preview" className="previewImage" />
      </div>
    </>
  );
}

export function FilePreview(props) {
  function removePreview() {
    const index = props.fileArr.findIndex((file) => file.name === props.name);
    props.fileArr.splice(index, 1);
    props.setFileArr([...props.fileArr]);
    const customIndex = props.customFilesArr.findIndex((file) => file.name === props.name);
    props.customFilesArr.splice(customIndex, 1);
    props.setCustomFilesArr([...props.customFilesArr]);    
  }

  return (<>
    <div className="previewFileContainer">
      <IonIcon icon={Icon.close} className="removePreview" onClick={removePreview}></IonIcon>
      <div className="fileInfo">
        <div className="fileIcon">
          {setFileIcon(props, "previewIcon")}
        </div>
        <div className="fileName">
          {props.name}
        </div>
        <div className="fileSize">
          {props.size}
        </div>
      </div>
    </div>
  </>)
}

export function VideoPreview(props) {
  function removePreview() {
    const index = props.fileArr.findIndex((file) => file.name === props.name);
    props.fileArr.splice(index, 1);
    props.setFileArr([...props.fileArr]);
    const customIndex = props.customFilesArr.findIndex((file) => file.name === props.name);
    props.customFilesArr.splice(customIndex, 1);
    props.setCustomFilesArr([...props.customFilesArr]);
  }

  return (<>
    <div className="previewVideoContainer">
      <IonIcon onClick = {removePreview} icon={Icon.close} className="removePreview"></IonIcon>
      <video src={props.src} className="previewVideo"></video>
      <div className="preventPlayModal"></div>
      <IonIcon icon={Icon.playOutline} className="playIcon"></IonIcon>
    </div>
  </>)
}