import Socket from "./Socket";
import Cookies from "js-cookie";
import { toastSuccess } from "./Toast";
import { useContext } from "react";
import userContext from "./userData";
import MessageReply from "./MessageReply";

export function MessageImageRecipient(props) {
	const [user, setUser] = useContext(userContext);
	function deleteImage() {
		const updateMessage = props.messageArray.map((message) => {
			if (Array.isArray(message) && message[0].ID === props.ID) {
				return message.map((mess) => {
					return {
						...mess,
						recipientHide: true,
					};
				});
			} else if (!Array.isArray(message) && message.ID === props.ID) {
				return {
					...message,
					recipientHide: true,
				};
			}
			return message;
		});
		props.setMessage(updateMessage);
		Socket.emit("deleteRImage", {
			ID: props.ID,
			room: Cookies.get("currentRoom"),
			timestamp: props.timestamp,
			uuid: props.uuid,
		});
		toastSuccess("Image(s) hidden");
	}
	function reply() {
		props.setReplyTo(props.sender ? user.user : user.receiverName);
		props.setReplyMessage(props.src);
		props.setIsReply(true);
		props.setReplyID(props.ID);
		props.setReplyType("image");
	}
	return (
		<>
			<MessageReply
				replyMessage={props.replyMessage}
				replyMessageType={props.replyMessageType}
				isReplier={props.replier === user.ID}
				isReply={props.isReply}
				replier={props.replier}
				reply={props.reply}
			></MessageReply>
			<div className="imageWrap recipient">
				<div
					className="imageContainer recipient"
					style={{
						gridTemplateColumns: `repeat(${Math.min(
							props.src.length,
							3
						)},auto)`,
					}}
				>
					{props.isArray ? (
						props.src.map((src) => {
							return <img alt="" className="image" src={src.file} />;
						})
					) : (
						<img alt="" className="image" src={props.src.file} />
					)}
				</div>
				<div className="imageOptions recipient">
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="imageOptionSelection recipient" style={{ height: 0 }}>
						<div className="imageOption deleteImage" onClick={deleteImage}>
							Delete image(s)
						</div>
						<div className="imageOption replyImage" onClick={reply}></div>
					</div>
				</div>
			</div>
		</>
	);
}

export function MessageImageSender(props) {
	const [user, setUser] = useContext(userContext);
	function deleteImage() {
		const updateMessage = props.messageArray.map((message) => {
			if (Array.isArray(message) && message[0].ID === props.ID) {
				return message.map((mess) => {
					return {
						...mess,
						senderHide: true,
						content: "",
					};
				});
			} else if (!Array.isArray(message) && message.ID === props.ID) {
				return {
					...message,
					senderHide: true,
					content: "",
				};
			}
			return message;
		});
		props.setMessage(updateMessage);
		Socket.emit("deleteSImage", {
			ID: props.ID,
			room: Cookies.get("currentRoom"),
			timestamp: props.timestamp,
			uuid: props.uuid,
		});
		toastSuccess("Image(s) deleted");
	}

	function reply() {
		props.setReplyTo(props.sender ? user.user : user.receiverName);
		props.setReplyMessage(() => {
			const images = [];
			for(let i = 0; i < props.src.length; i++){
				images.push(props.src[i].file);	
			}
			return images;
		});
		props.setIsReply(true);
		props.setReplyID(props.ID);
		props.setReplyType("image");
	}
	return (
		<>
			<MessageReply
				replyMessage={props.replyMessage}
				replyMessageType={props.replyMessageType}
				isReplier={props.replier === user.ID}
				isReply={props.isReply}
				replier={props.replier}
				reply={props.reply}
			></MessageReply>
			<div className="imageWrap sender">
				<div className="imageOptions sender">
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="imageOptionSelection sender" style={{ height: 0 }}>
						<div className="imageOption deleteImage" onClick={deleteImage}>
							Delete image(s)
						</div>
						<div className="imageOption replyImage" onClick={reply}>
							Reply
						</div>
					</div>
				</div>
				<div
					className="imageContainer"
					style={{
						gridTemplateColumns: `repeat(${Math.min(
							props.src.length,
							3
						)},auto)`,
					}}
				>
					{props.isArray ? (
						props.src.map((src) => {
							return (
								<img
									key={Math.random() * (99999999999 - 0)}
									alt=""
									className="image"
									src={src.file}
								/>
							);
						})
					) : (
						<img
							key={Math.random() * (99999999999 - 0)}
							alt=""
							className="image"
							src={props.src.file}
						/>
					)}
				</div>
			</div>
		</>
	);
}
