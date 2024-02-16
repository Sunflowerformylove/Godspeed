import "../Style/Chat.css";
import Socket from "./Socket";
import Cookies from "js-cookie";
import { useState, useContext, useEffect } from "react";
import { toastSuccess } from "./Toast";
import { VideoSender, VideoRecipient } from "./Video";
import { MessageImageRecipient, MessageImageSender } from "./Image";
import { MessageFileRecipient, MessageFileSender } from "./File";
import { MessageAudioRecipient, MessageAudioSender } from "./Audio";
import userContext from "./userData";
import MessageReply from "./MessageReply";
// import { Swiper, SwiperSlide } from 'swiper/react';

export function MessageRecipient(props) {
	const [allowDownload, setAllowDownload] = useState(false);
	const [user, setUser] = useContext(userContext);
	function deleteFunction() {
		props.setAllowScroll(false);
		props.setMessage(props.messageArray.filter((mess) => mess.ID !== props.ID));
		Socket.emit("deleteRMessage", {
			ID: props.ID,
			room: Cookies.get("currentRoom"),
		});
		toastSuccess("Message hidden");
	}
	function copyFunction() {
		navigator.clipboard.writeText(props.message);
		toastSuccess("Copied to clipboard");
	}
	function reply() {
		props.setReplyTo(props.sender ? user.user : user.receiverName);
		props.setReplyMessage(props.message);
		props.setIsReply(true);
		props.setReplyID(props.senderID);
	}
	return (
		<>
			<MessageReply
				replyMessage={props.replyMessage}
				replyType={props.replyType}
				isReplier={props.replier === user.ID}
				isReply={props.isReply}
			></MessageReply>
			<div className="message">
				<div className="bubble recipient">{props.message}</div>
				<div className="options">
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="optionsSelection recipient" style={{ height: 0 }}>
						<div className="option eraseMessage" onClick={deleteFunction}>
							Erase this message
						</div>
						<div className="option copyMessage" onClick={copyFunction}>
							Copy this message
						</div>
						<div className="option replyMessage" onClick={reply}>
							Reply
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export function MessageSender(props) {
	const [user, setUser] = useContext(userContext);
	function deleteFunction() {
		props.setAllowScroll(false);
		const updateMessage = props.messageArray.map((message) => {
			if (message.ID === props.ID) {
				return {
					...message,
					senderHide: true,
					content: "",
				};
			}
			return {
				...message,
			};
		});
		props.setMessage(updateMessage);
		Socket.emit("deleteSMessage", {
			ID: props.ID,
			room: Cookies.get("currentRoom"),
		});
		toastSuccess("Message deleted");
	}
	function copyFunction() {
		navigator.clipboard.writeText(props.message);
		toastSuccess("Copied to clipboard");
	}

	function reply() {
		props.setReplyTo(props.sender ? user.user : user.receiverName);
		props.setReplyMessage(props.message);
		props.setIsReply(true);
		props.setReplyID(props.senderID);
		props.setReplyType("text");
	}

	return (
		<>
			<MessageReply
				replyMessage={props.replyMessage}
				replyType={props.replyType}
				isReplier={props.replier === user.ID}
				isReply={props.isReply}
			></MessageReply>
			<div className="message sender">
				<div className="bubble sender">{props.message}</div>
				<div className="options sender">
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="optionsSelection sender" style={{ height: 0 }}>
						<div className="option eraseMessage" onClick={deleteFunction}>
							Erase this message
						</div>
						<div className="option copyMessage" onClick={copyFunction}>
							Copy this message
						</div>
						<div className="option replyMessage" onClick={reply}>
							Reply
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export function MessageDeletedSender() {
	return (
		<>
			<div className="message">
				<div className="bubble deleted sender">You unsent this message.</div>
			</div>
		</>
	);
}

export function MessageDeletedRecipient() {
	return (
		<>
			<div className="message">
				<div className="bubble deleted recipient">This message was unsent.</div>
			</div>
		</>
	);
}

export default function Message(props) {
	if (props.sender && !props.senderHide) {
		return (
			<MessageSender
				allowScroll={props.allowScroll}
				setAllowScroll={props.setAllowScroll}
				ID={props.ID}
				senderID={props.senderID}
				sender={props.sender}
				message={props.message}
				setMessage={props.setMessage}
				messageArray={props.messageArray}
				setReplyMessage={props.setReplyMessage}
				setReplyTo={props.setReplyTo}
				setIsReply={props.setIsReply}
				setReplyID={props.setReplyID}
				setReplyType={props.setReplyType}
				replyMessage={props.replyMessage}
				replyType={props.replyType}
				replier={props.replier}
				reply={props.reply}
				isReply={props.replyMessage === "NULL" ? false : true}
			/>
		);
	} else if (!props.sender && !props.recipientHide && !props.senderHide) {
		return (
			<MessageRecipient
				allowScroll={props.allowScroll}
				setAllowScroll={props.setAllowScroll}
				ID={props.ID}
				senderID={props.senderID}
				sender={props.sender}
				message={props.message}
				setMessage={props.setMessage}
				messageArray={props.messageArray}
				setReplyMessage={props.setReplyMessage}
				setReplyTo={props.setReplyTo}
				setIsReply={props.setIsReply}
				setReplyID={props.setReplyID}
				setReplyType={props.setReplyType}
				replyMessage={props.replyMessage}
				replyType={props.replyType}
				replier={props.replier}
				reply={props.reply}
				isReply={props.replyMessage === "NULL" ? false : true}
			/>
		);
	} else if (props.sender && props.senderHide) {
		return <MessageDeletedSender />;
	} else if (!props.sender && props.senderHide) {
		return <MessageDeletedRecipient />;
	}
}

export function MessageImage(props) {
	if (props.sender && !props.senderHide) {
		return (
			<MessageImageSender
				key={Math.random() * (9999999999 - 0)}
				senderID={props.senderID}
				isArray={props.isArray}
				src={props.src}
				messageArray={props.messageArray}
				setMessage={props.setMessage}
				ID={props.ID}
				timestamp={props.timestamp}
				uuid={props.uuid}
				setReplyMessage={props.setReplyMessage}
				setReplyTo={props.setReplyTo}
				setIsReply={props.setIsReply}
				setReplyID={props.setReplyID}
				setReplyType={props.setReplyType}
				replyMessage={props.replyMessage}
				replyType={props.replyType}
				replier={props.replier}
				reply={props.reply}
				isReply={props.replyMessage === "NULL" ? false : true}
			/>
		);
	} else if (!props.sender && !props.recipientHide && !props.senderHide) {
		return (
			<MessageImageRecipient
				key={Math.random() * (9999999999 - 0)}
				senderID={props.senderID}
				isArray={props.isArray}
				src={props.src}
				ID={props.ID}
				messageArray={props.messageArray}
				setMessage={props.setMessage}
				timestamp={props.timestamp}
				uuid={props.uuid}
				setReplyMessage={props.setReplyMessage}
				setReplyTo={props.setReplyTo}
				setIsReply={props.setIsReply}
				setReplyID={props.setReplyID}
				setReplyType={props.setReplyType}
				replyMessage={props.replyMessage}
				replyType={props.replyType}
				replier={props.replier}
				reply={props.reply}
				isReply={props.replyMessage === "NULL" ? false : true}
			/>
		);
	} else if (props.sender && props.senderHide) {
		return <MessageDeletedSender />;
	} else if (!props.sender && props.senderHide) {
		return <MessageDeletedRecipient />;
	}
}

export function MessageFile(props) {
	if (props.sender && !props.senderHide) {
		return (
			<MessageFileSender
				senderID={props.senderID}
				key={Math.random() * (9999999999 - 0)}
				filename={props.filename}
				size={props.size}
				mimetype={props.mimetype}
				name={props.name}
				type={props.type}
				isReply={props.replyMessage === "NULL" ? false : true}
			/>
		);
	} else if (!props.sender && !props.recipientHide && !props.senderHide) {
		return (
			<MessageFileRecipient
				senderID={props.senderID}
				key={Math.random() * (9999999999 - 0)}
				filename={props.filename}
				size={props.size}
				mimetype={props.mimetype}
				name={props.name}
				type={props.type}
				isReply={props.replyMessage === "NULL" ? false : true}
			/>
		);
	} else if (props.sender && props.senderHide) {
		return <MessageDeletedSender />;
	} else if (!props.sender && props.senderHide) {
		return <MessageDeletedRecipient />;
	}
}

export function Video(props) {
	if (props.sender && !props.senderHide) {
		return (
			<VideoSender
				senderID={props.senderID}
				uuid={props.uuid}
				ID={props.ID}
				messageArray={props.messageArray}
				setMessage={props.setMessage}
				senderHide={props.senderHide}
				sender={props.sender}
				recipientHide={props.recipientHide}
				setAllowScroll={props.setAllowScroll}
				url={props.url}
				setReplyID={props.setReplyID}
				setReplyMessage={props.setReplyMessage}
				setReplyTo={props.setReplyTo}
				setIsReply={props.setIsReply}
				setReplyType={props.setReplyType}
				isReply={props.replyMessage === "NULL" ? false : true}
			/>
		);
	} else if (!props.sender && !props.recipientHide && !props.senderHide) {
		return (
			<VideoRecipient
				uuid={props.uuid}
				ID={props.ID}
				senderID={props.senderID}
				messageArray={props.messageArray}
				setMessage={props.setMessage}
				senderHide={props.senderHide}
				sender={props.sender}
				recipientHide={props.recipientHide}
				setAllowScroll={props.setAllowScroll}
				url={props.url}
				setReplyID={props.setReplyID}
				setReplyMessage={props.setReplyMessage}
				setReplyTo={props.setReplyTo}
				setIsReply={props.setIsReply}
				setReplyType={props.setReplyType}
				isReply={props.replyMessage === "NULL" ? false : true}
			/>
		);
	} else if (props.sender && props.senderHide) {
		return <MessageDeletedSender />;
	} else if (!props.sender && props.senderHide) {
		return <MessageDeletedRecipient />;
	}
}

export function Audio(props) {
	if (props.sender && !props.senderHide) {
		return (
			<MessageAudioSender
				uuid={props.uuid}
				src={props.src}
				ID={props.ID}
				senderID={props.senderID}
				messageArray={props.messageArray}
				setMessage={props.setMessage}
				senderHide={props.senderHide}
				sender={props.sender}
				recipientHide={props.recipientHide}
				setAllowScroll={props.setAllowScroll}
				setReplyID={props.setReplyID}
				setReplyMessage={props.setReplyMessage}
				setReplyTo={props.setReplyTo}
				setIsReply={props.setIsReply}
				setReplyType={props.setReplyType}
				isReply={props.replyMessage === "NULL" ? false : true}
			/>
		);
	} else if (!props.sender && !props.recipientHide && !props.senderHide) {
		return (
			<MessageAudioRecipient
				uuid={props.uuid}
				src={props.src}
				ID={props.ID}
				messageArray={props.messageArray}
				setMessage={props.setMessage}
				senderHide={props.senderHide}
				sender={props.sender}
				recipientHide={props.recipientHide}
				setAllowScroll={props.setAllowScroll}
				setReplyID={props.setReplyID}
				setReplyMessage={props.setReplyMessage}
				setReplyTo={props.setReplyTo}
				setIsReply={props.setIsReply}
				setReplyType={props.setReplyType}
				isReply={props.replyMessage === "NULL" ? false : true}
			/>
		);
	} else if (props.sender && props.senderHide) {
		return <MessageDeletedSender />;
	} else if (!props.sender && props.senderHide) {
		return <MessageDeletedRecipient />;
	}
}
