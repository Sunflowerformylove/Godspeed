import "../Styles/Switch.css"
import {useRef} from "react"

export function BooleanSwitch(props){
    const booleanRef = useRef(null);
    function toggleBoolean(){
        booleanRef.current.classList.toggle("true");
    }
    return(
        <div className="switch">
            <div onClick={toggleBoolean} className="boolean" ref = {booleanRef}></div>
        </div>
    )
}