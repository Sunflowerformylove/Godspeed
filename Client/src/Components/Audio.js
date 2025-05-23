import "../Style/Chat.css";
import Socket from "./Socket";
import Cookies from "js-cookie";
import userContext from "./userData";
import { useContext } from "react";
import MessageReply from "./MessageReply";

export function MessageAudioSender(props) {
	const [user, setUser] = useContext(userContext);
	function deleteFunction() {
		const updatedMessage = props.messageArray.map((message) => {
			if (message.uuid === props.uuid) {
				message.content = "deleted";
				message.senderHide = true;
				return message;
			}
			return message;
		});
		props.setMessage(updatedMessage);
		props.setAllowScroll(false);
		Socket.emit("deleteSAudio", {
			ID: props.id,
			room: Cookies.get("currentRoom"),
			type: props.type,
			uuid: props.uuid,
			filename: props.filename,
			originalname: props.originalname,
			location: props.location,
		});
	}
	function reply() {
		props.setReplyTo(props.sender ? user.user : user.receiverName);
		props.setReplyMessage(props.src);
		props.setIsReply(true);
		props.setReplyID(props.senderID);
		props.setReplyType("audio");
	}
	return (
		<>
			<MessageReply
				replyMessage={props.replyMessage}
				replyMessageType={props.replyMessageType}
				isReplier={props.replier === user.ID}
				isReply = {props.isReply}
				replier={props.replier}
				reply={props.reply}
			></MessageReply>
			<div className="audioContainer sender">
				<div className="options sender">
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="optionsSelection sender" style={{ height: 0 }}>
						<div className="option eraseMessage" onClick={deleteFunction}>
							Retrieve this audio
						</div>
						<div className="option copyMessage">Report for violation</div>
						<div className="option replyMessage" onClick={reply}>
							Reply
						</div>
					</div>
				</div>
				<audio src={props.src} controls className="audio"></audio>
			</div>
		</>
	);
}

export function MessageAudioRecipient(props) {
	const [user, setUser] = useContext(userContext);
	function deleteFunction() {
		const updatedMessage = props.messageArray.map((message) => {
			if (message.uuid === props.uuid) {
				message.recipientHide = true;
				return message;
			}
			return message;
		});
		props.setMessage(updatedMessage);
		props.setAllowScroll(false);
		Socket.emit("deleteRAudio", {
			ID: props.id,
			room: Cookies.get("currentRoom"),
			type: props.type,
			uuid: props.uuid,
			filename: props.filename,
			originalname: props.originalname,
			location: props.location,
		});
	}
	function reply() {
		props.setReplyTo(props.sender ? user.user : user.receiverName);
		props.setReplyMessage(props.src);
		props.setIsReply(true);
		props.setReplyID(props.senderID);
		props.setReplyType("audio");
	}
	return (
		<>
			<MessageReply
				replyMessage={props.replyMessage}
				replyMessageType={props.replyMessageType}
				isReplier={props.replier === user.ID}
				isReply = {props.isReply}
				replier={props.replier}
				reply={props.reply}
			></MessageReply>
			<div className="audioContainer recipient">
				<audio src={props.src} controls className="audio"></audio>
				<div className="options recipient">
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="optionsSelection recipient" style={{ height: 0 }}>
						<div className="option eraseMessage" onClick={deleteFunction}>
							Hide this audio
						</div>
						<div className="option copyMessage">Report for violation</div>
						<div className="option replyMessage" onClick={reply}>
							Reply
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
