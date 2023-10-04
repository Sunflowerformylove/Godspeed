import "../Style/Slider.css"
import { useRef, useState, useEffect, useContext } from "react"
import { ChatConfigContext } from "./Setting";
// I have to customize the slider because the default one is not good enough

export function Slider(props) {
    const [value, setValue] = useState(props.value);
    const tooltipRef = useRef(null);
    const [Setting, setSetting] = useContext(ChatConfigContext);

    function handleChange(e) {
        setValue(e.target.value);
        setSetting(prev => {
            return {
                ...prev,
                Appearance: {
                    ...prev.Appearance,
                    [props.usage]: e.target.value
                }
            }
        });
    }

    useEffect(() => {
        if (props.usage === "BubbleRadius") {
            tooltipRef.current.style.borderRadius = value + "%";
        }
    }, [value, props.usage]);

    return (
        <div className="slider">
            <input type="range" min={props.min} max={props.max} defaultValue={props.value} onChange={event => handleChange(event)} className="sliderInput" />
            <div ref={tooltipRef} className="tooltip">{
            props.mode === "Percentage" ? value : value / 100}</div>
        </div>
    )
}