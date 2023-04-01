import "../Style/RoomNav.css";
import { forwardRef, useEffect, useRef, useState } from "react";
import {Room} from "./Room";
import axios from "axios";
export const RoomNav = forwardRef((props, ref) => {
  const searchIconRef = useRef(null);
  const roomRef = useRef(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const handleClick = (room) => {
    setActiveRoom(room);
  };
  const [searchResult, setSearchRes] = useState([]);
  function searchUser(event) {
    axios({
      method: "POST",
      url: "http://localhost:3000/search",
      data: JSON.stringify({ search: event.target.value }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.data)
      .then((data) => {
        setSearchRes(data);
      });
  }
  return (
    <>
      <div className="roomNav">
        <div className="navHeader">
          <span className="textTitle">Chats</span>
          <input
            name="search"
            onFocus={() => {
              searchIconRef.current.style.display = "none";
            }}
            onBlur={(event) => {
              if (event.target.value.length === 0) {
                searchIconRef.current.style.display = "flex";
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
        <div className="roomContainer"></div>
        <div className="searchContainer">
          {searchResult.map((user) => {
            return <Room key={user.ID} ref = {ref} ID={user.ID} message = {props.message} setMessage = {props.setMessage} name={user.user} />;
          })}
        </div>
      </div>
    </>
  );
});
