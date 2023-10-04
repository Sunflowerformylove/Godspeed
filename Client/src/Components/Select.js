import { useState, useContext, useEffect, useRef } from "react";
import { ChatConfigContext } from "./Setting";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";
import "../Style/Select.css";

export function Select(props) {
    const dropdownRef = useRef(null);
    const selectRef = useRef(null);

    function handleOpenSelection(){
        selectRef.current.focus();
    }

    function onChangeRingtone(){
        props.setValue(selectRef.current.value);
    }

    return (
        <div className="select">
            <select ref={selectRef} onChange={onChangeRingtone}>
                {props.options.map((option, index) => {
                    return (
                        <option key={index} value={option}>{option}</option>
                    )
                })}
            </select>
            <IonIcon ref = {dropdownRef} onClick = {handleOpenSelection} className="dropdown" icon = {Icon.caretDown}></IonIcon>
        </div>
    )
}