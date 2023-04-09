import "../Style/RoomNav.css";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Room, RoomExist } from "./Room";
import axios from "axios";
import Cookies from "js-cookie";
import Socket from "./Socket";
export const RoomNav = forwardRef((props, ref) => {
  const searchIconRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [searchResult, setSearchRes] = useState([]);
  const [room, setRoom] = useState([]);
  useEffect(() => {
    Socket.emit("getRoom", Cookies.get("userID"));
    Socket.on("loadRoom", (data) => {
      setRoom(data);
    });
  }, []);
  useEffect(() => {});
  function searchUser(event) {
    if (event.target.value.trim() !== "") {
      axios({
        method: "POST",
        url: "http://localhost:3000/search",
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

  useEffect(() => {
    for (let i = 0; i < room.length; i++) {
      if (
        room[i].roomID === props.newRoom.roomID &&
        room[i].recipient === props.newRoom.recipient
      ) {
        props.newRoom.roomName = room[i].roomName;
        props.newRoom.recipientName = room[i].recipientName;
        props.newRoom.senderName = room[i].senderName;
        let temp = room;
        temp.splice(i, 1);
        temp.unshift(props.newRoom);
        setRoom(temp);
        return;
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
                lastMessage={
                  !props.currentMessage[room.roomID]
                    ? room.lastMessage
                    : props.currentMessage[room.roomID].content
                }
                timestamp={room.timestamp}
                sender={props.currentMessage.sender}
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
