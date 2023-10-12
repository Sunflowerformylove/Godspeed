import "../Style/RoomNav.css";
import { useContext } from "react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Room, RoomExist } from "./Room";
import axios from "axios";
import userContext from "./userData";
import Socket from "./Socket";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";

export const RoomNav = forwardRef((props, ref) => {
  const searchIconRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [searchResult, setSearchRes] = useState([]);
  const [room, setRoom] = useState([]);
  const [user, setUser] = useContext(userContext);
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

  function openSetting(){
    props.generalSettingRef.current.classList.add("show");
  }

  return (
    <>
      <div className={`roomNav ${props.themeName}`}>
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
          <IonIcon ref={searchIconRef} icon={Icon.searchOutline} className="searchIcon"></IonIcon>
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
                latestMessage={!props.latestMessage[`${room.roomID}`] ? room.lastMessage : props.latestMessage[`${room.roomID}`].content}
                sender={!props.latestMessage[`${room.roomID}`] ? room.senderName : props.latestMessage[`${room.roomID}`].sender}
                timestamp={room.timestamp}
                themeName={props.themeName}
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
                themeName={props.themeName}
              />
            );
          })}
        </div>
        <div className="RoomNavFooter">
          <div onClick = {openSetting} className="generalSetting">
            <IonIcon icon={Icon.settingsSharp}></IonIcon>
          </div>
          <div className="version">
            <span>Version 1.0.0</span>
          </div>
          <div className="reportBug">
            <IonIcon icon = {Icon.bugSharp}></IonIcon>
          </div>
        </div>
      </div>
    </>
  );
});
