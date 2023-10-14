import "../Style/Switch.css"
import {useEffect, useRef} from "react"

export function BooleanSwitch(props){
    const booleanRef = useRef(null);
    const switchRef = useRef(null);
    function toggleBoolean(){
        booleanRef.current.classList.toggle("true");
        switchRef.current.classList.toggle("true");
        props.setTrue(!props.isTrue);
    }
    useEffect(() => {
        if(props.isTrue){
            booleanRef.current.classList.add("true");
            switchRef.current.classList.add("true");
        }
        else{
            booleanRef.current.classList.remove("true");
            switchRef.current.classList.remove("true");
        }
    })
    return(
        <div onClick = {toggleBoolean} className="switch" ref = {switchRef}>
            <div onClick={toggleBoolean} className="boolean" ref = {booleanRef}></div>
        </div>
    )
}