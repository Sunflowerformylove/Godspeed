import { useRef} from "react";

export default function InputAndLabel(props) {
  const inputRef = useRef(null);

  function handleInputChange(event){
    props.parentCallback(props.inputName,event.target.value);
  }

  function checkPhone(event) {
    const truetype = event.target.getAttribute("data-truetype");
    if (truetype === "phone") {
      if (
        (event.key < "0" || event.key > "9") &&
        event.key !== "Backspace" &&
        event.key !== "Delete" &&
        event.key !== "Enter" &&
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight"
      ) {
        event.preventDefault();
      }
    }
    handleInputChange(event);
  }
  return (
    <div className={props.className}>
      <label htmlFor={props.inputName}>{props.labelName}</label>
      <input
        ref={inputRef}
        onChange={(event) => {
          checkPhone(event);
        }}
        data-value=""
        data-truetype={props.truetype}
        type={props.type}
        name={props.inputName}
      />
    </div>
  );
}