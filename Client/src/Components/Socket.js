import { io } from "socket.io-client";
const URL = "https://localhost:3000";
const Socket = io(URL, {autoConnect: false});
// Socket.onAny((event,...args) => {
//     console.log(event, args);
// })

export default Socket;