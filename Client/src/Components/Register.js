import InputAndLabel from "./Input";
import "../Style/Register.css";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { toastSuccess, toastError, toastPromise } from "./Toast";
import Login from "./Login";
import axios from "axios";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";

export default function Register() {
  const eyeRef = useRef(null);
  const [loginCall, setLoginCall] = useState(false);
  const [passwordProp, setPasswordProp] = useState("password");
  const [passState, setPassState] = useState(true);
  const [eyeState, setEyeState] = useState(Icon.eyeOutline);
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    verifyPassword: "",
    otp: "",
    phone: "",
  });
  const otpRef = useRef(null);
  const submitRef = useRef(null);
  function handleCallback(name, childData) {
    setForm({ ...form, [name]: childData });
  }


  function sendOTP() {
    let email = form.email;
    let formData = { email: email };
    if (email !== "" && email !== undefined) {
      toastPromise(
        axios("https://localhost:3000/OTP", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(formData),
        }),
        "Sending OTP...",
        "OTP sent successfully",
        "Failed to send OTP"
      );
    }
    else {
      toastError("Email has not been set!");
    }
  }

  function register() {
    let user = form;
    let formData = { user: user };
    axios("https://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(formData),
    })
      .then((response) => {
        JSON.stringify(response);
        console.log(response.data);
        if (response.data.errorCode === 1) {
          toastError("Passwords mismatch!");
        } else if (response.data.errorCode === 2) {
          toastError("Cannot verify OTP!");
        } else if (response.data.errorCode === 3) {
          toastError("Field(s) required!");
        } else if (response.data.errorCode === 4) {
          toastError("Email and/or username exists!");
        } else if (response.data.errorCode === 0) {
          toastSuccess("Congrats!!!", () => {
            setLoginCall(true);
          });
        }
      });
  }

  function togglePassword() {
    if (passState) {
      setEyeState(Icon.eyeOffOutline);
      setPasswordProp("text");
      setPassState(false);
    } else {
      setEyeState(Icon.eyeOutline);
      setPasswordProp("password");
      setPassState(true);
    }
  }

  function switchToLogin() {
    toast.dismiss();
    setLoginCall(true);
  }

  if (loginCall) {
    return <Login />;
  }

  return (
    <>
      <div className="registerPage">
        <InputAndLabel
          parentCallback={handleCallback}
          className="InputAndLabel"
          inputName="email"
          labelName="Email"
          type="email"
        />
        <InputAndLabel
          parentCallback={handleCallback}
          className="InputAndLabel"
          inputName="username"
          labelName="Username"
          type="text"
        />
        <InputAndLabel
          parentCallback={handleCallback}
          className="InputAndLabel"
          inputName="password"
          labelName="Password"
          type={passwordProp}
        />
        <InputAndLabel
          parentCallback={handleCallback}
          className="InputAndLabel"
          inputName="verifyPassword"
          labelName="Verify Password"
          type={passwordProp}
        />
        <InputAndLabel
          parentCallback={handleCallback}
          className="InputAndLabel"
          inputName="otp"
          labelName="Verification OTP"
          type="text"
        />
        <InputAndLabel
          parentCallback={handleCallback}
          className="InputAndLabel"
          inputName="phone"
          labelName="Phone"
          type="text"
          truetype="phone"
        />
        <IonIcon icon={Icon.reload}
          ref={otpRef}
          onClick={sendOTP}
          className="resendOTP"></IonIcon>
        <div onClick={switchToLogin} className="loginRedirect">
          Already have an account?{" "}
          <span className="signInKeyword">Sign in now!</span>
        </div>
        <IonIcon
        icon = {eyeState}
        className="eyeIcon"
        ref={eyeRef}
        onClick={togglePassword}
        ></IonIcon>
        <button ref={submitRef} onClick={register} className="submitBtn">
          Get Started
        </button>
      </div>
    </>
  );
}
