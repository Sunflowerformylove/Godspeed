import InputAndLabel from "./Input";
import "../Style/Register.css";
import { useRef, useState } from "react";
import anime from "animejs/lib/anime.es.js";
import toast, { Toaster } from "react-hot-toast";
export default function Register() {
  const toasterRef = useRef(null);
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
      fetch("http://localhost:3000/OTP", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            console.log("OTP sent successfully");
          } else {
            throw new Error("Failed to send OTP");
          }
        })
        .catch((err) => console.error(err));
    }
  }

  function register() {
    let user = form;
    let formData = { user: user };
    fetch("http://localhost:3000/register", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((response) => {
      if (response.ok) {
        toast.success("Success!", {
          position: "top-center",
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            fontSize: '2rem',
          },      
        });
      } else {
        toast.error("Not good", {
          position: "top-center",
          duration: 3000,
          style: {
            borderRadius: "20px",
            background: "transparent",
            color: "#fff",
            fontFamily: "Montserrat",
          },
        });
      }
    });
  }

  return (
    <>
      <Toaster></Toaster>
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
          type="password"
        />
        <InputAndLabel
          parentCallback={handleCallback}
          className="InputAndLabel"
          inputName="verifyPassword"
          labelName="Verify Password"
          type="password"
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
        <i
          ref={otpRef}
          onClick={sendOTP}
          className="fa-solid fa-rotate-right resendOTP"
        ></i>
        <span className="loading"></span>
        <button ref={submitRef} onClick={register} className="submitBtn">
          Get Started
        </button>
        {/* <div className="modal">
            <div className = "g-recaptcha" data-sitekey = "6LffXBYlAAAAAF2zYRsDf8kZvMn1zZP0Ky-fAeWB" data-theme="dark" data-size="compact">Captcha</div>
        </div>  this will be for later, I still can't figure out why the box was blackout*/}
      </div>
    </>
  );
}
