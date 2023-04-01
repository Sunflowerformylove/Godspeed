import "../Style/Chat.css";

export function MessageRecipient(props) {
  return (
    <>
      <div className="message">
        <div className="outerMessage"></div>
        <div className="innerMessage">
          <div className="bubble recipient">{props.message}</div>
        </div>
      </div>
    </>
  );
}

export function MessageSender(props) {
  return (
    <>
      <div className="message">
        <div className="outerMessage"></div>
        <div className="innerMessage">
          <div className="bubble sender">{props.message}</div>
        </div>
      </div>
    </>
  );
}


export default function Message(props){
  if(props.sender){
    return <MessageSender message={props.message}/>
  }
  else{
    return <MessageRecipient message={props.message}/>
  }
}