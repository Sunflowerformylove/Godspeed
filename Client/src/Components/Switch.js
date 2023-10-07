import "../Style/Switch.css"
import {useRef} from "react"

export function BooleanSwitch(props){
    const booleanRef = useRef(null);
    const switchRef = useRef(null);
    function toggleBoolean(){
        booleanRef.current.classList.toggle("true");
        switchRef.current.classList.toggle("true");
        props.setTrue(!props.isTrue);
    }
    return(
        <div onClick = {toggleBoolean} className="switch" ref = {switchRef}>
            <div onClick={toggleBoolean} className="boolean" ref = {booleanRef}></div>
        </div>
    )
}