import "../Style/RoomNav.css";
import { useContext } from "react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Room, RoomExist } from "./Room";
import axios from "axios";
import userData from "./userData";
import Socket from "./Socket";

export const RoomNav = forwardRef((props, ref) => {
  const searchIconRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [searchResult, setSearchRes] = useState([]);
  const [room, setRoom] = useState([]);
  const user = useContext(userData);
  useEffect(() => {
    Socket.emit("getRoom", user.ID);
    Socket.on("loadRoom", (data) => {
      setRoom(data);
    });
  }, []);
  function searchUser(event) {
    if (event.target.value.trim() !== "") {
      axios({
        method: "POST",
        url: "https://localhost:3000/search",
        data: JSON.stringify({ search: event.target.value.trim() }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.data)
        .then((data) => {
          setSearchRes(data);
        });
    } else {
      setSearchRes([]);
    }
  }

  function checkContain(arr, obj) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].roomID === obj.roomID) {
        return true;
      }
    }
    return false;
  }   

  useEffect(() => {
    for (let i = 0; i < room.length; i++) {
      if (
        room[i].roomID === props.newRoom.roomID &&
        room[i].recipient === props.newRoom.recipient
      ) {
        props.newRoom.roomName = room[i].roomName;
        props.newRoom.recipientName = room[i].recipientName;
        props.newRoom.senderName = room[i].senderName;
        props.newRoom.lastMessage = room[i].lastMessage;
        let temp = room;
        temp.splice(i, 1);
        temp.unshift(props.newRoom);
        setRoom(temp);
        return;
      }
    }
    if (!checkContain(room, props.newRoom)) {
      if (props.newRoom.roomID !== undefined) {
        setRoom([props.newRoom, ...room]);
      }
    }
  }, [props, room]);

  return (
    <>
      <div className="roomNav">
        <div className="navHeader">
          <span className="textTitle">Chats</span>
          <input
            name="search"
            onFocus={() => {
              searchIconRef.current.style.display = "none";
              searchContainerRef.current.style.display = "flex";
            }}
            onBlur={(event) => {
              if (event.target.value.length === 0) {
                searchIconRef.current.style.display = "flex";
                searchContainerRef.current.style.display = "none";
              }
            }}
            onInput={(event) => {
              searchUser(event);
            }}
            className="searchBar"
          />
          <i
            ref={searchIconRef}
            className="fa-solid fa-magnifying-glass searchIcon"
          ></i>
        </div>
        <div className="roomContainer">
          {room.map((room) => {
            return (
              <RoomExist
                key={room.roomID}
                ID={room.recipient}
                roomID={room.roomID}
                message={props.message}
                setMessage={props.setMessage}
                ref={ref}
                name={room.roomName}
                latestMessage = {!props.latestMessage[`${room.roomID}`] ? room.lastMessage : props.latestMessage[`${room.roomID}`].content}
                sender = {!props.latestMessage[`${room.roomID}`] ? room.senderName : props.latestMessage[`${room.roomID}`].sender}
                timestamp={room.timestamp}
              />
            );
          })}
        </div>
        <div ref={searchContainerRef} className="searchContainer">
          {searchResult.map((user) => {
            return (
              <Room
                key={user.ID}
                ref={ref}
                ID={user.ID}
                searchContainerRef={searchContainerRef}
                message={props.message}
                setMessage={props.setMessage}
                name={user.user}
              />
            );
          })}
        </div>
      </div>
    </>
  );
});
