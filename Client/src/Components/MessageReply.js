import { useState, useContext, useEffect, useRef, useCallback } from "react";
import "../Style/MessageReply.css";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";
import userContext from "./userData";

export default function MessageReply(props) {
	const [user, setUser] = useContext(userContext);
	const [announce, setAnnounce] = useState("");
	const containerRef = useRef(null);
	const typeOfAnnounce = useCallback(() => {
		if (props.replier === user.ID) {
			// if the replier is the user
			if (props.reply === user.receiver) {
				setAnnounce(`You have reply to ${props.replyName}`);
			} else if (props.reply === user.ID) {
				setAnnounce(`You have reply to yourself`);
			}
		} else if (props.replier === user.receiver) {
			// if the replier is the user
			if (props.reply === user.ID) {
				setAnnounce(`${props.replyName} has reply to you`);
			} else if (props.reply === user.receiver) {
				setAnnounce(`${props.replyName} has reply to themselves`);
			}
		}
	}, [props, user]);

	useEffect(() => {
		console.log(props);
		typeOfAnnounce();
	}, []);

	return (
		<>
			{props.isReply ? (
				<div ref={containerRef}
					className={`repContainer ${props.isReplier ? "sender" : "receiver"}`}
				>
					<div className="repAnnounce">{announce}</div>
					{props.replyType === "text" ? (
						<div className="repText">{props.replyMessage}</div>
					) : props.replyType === "image" ? (
						<img src="/logo192.png" alt="" className="repImage" />
					) : props.replyType === "audio" ? (
						<audio controls src="/teams.mp3" className="repAudio"></audio>
					) : props.replyType === "file" ? (
						<div className="repFile">
							<div className="repFileName">Lorem.txt</div>
							<div className="repFileSize">12KB</div>
						</div>
					) : props.replyType === "youtube" ? (
						<div className="repYoutube">
							<IonIcon
								icon={Icon.logoYoutube}
								className="youtubeIcon"
							></IonIcon>
							<div className="youtubeUrl">{props.replyMessage}</div>
						</div>
					) : null}
				</div>
			) : null}
		</>
	);
}
