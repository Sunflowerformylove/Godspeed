import InputAndLabel from "./Input";
import Register from "./Register";
import {useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Connecting from "./Connecting";
import "../Style/Login.css";
import userData from "./userData";
import Socket from "./Socket.js";


export default function Login() {
  const [user, setUser] = useContext(userData);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [connectingCall, setConnectingCall] = useState(false);
  const [toggleLogin, setToggleLogin] = useState(true);
  const [registerCall, setRegisterCall] = useState(false);

  function handleCallback(name, childData) {
    setForm({ ...form, [name]: childData });
  }

  function redirectToRegister() {
    setRegisterCall(true);
  }

  useEffect(() => {
    Socket.connect();
  },[connectingCall])

  function login() {
    setToggleLogin(false);
    let formData = { user: form };
    const loginPromise = new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: "https://localhost:3000/login",
        data: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          if (data.errorCode === 1) {
            throw Error("Username or password exists!");
          } else if (data.errorCode === 2) {
            throw Error("Field(s) required!");
          } else {
            resolve(data);
          }
        })
        .catch((error) => reject(error));
    });
    toast.promise(loginPromise, {
      pending: "Signing in...",
      success: {
        render({ data }) {
          user.username = data.user;
          user.ID = data.ID;
          setUser(user);
          return `Welcome ${data.user}`;
        },
        onClose: () => {
          setToggleLogin(true);
          setConnectingCall(true);
        },
        pauseOnFocusLoss: false,
        autoClose: 2000,
      },
      error: {
        render({ data }) {
          return `${data.message}`;
        },
        onClose: ({ data }) => {
          setToggleLogin(true);
        },
        pauseOnFocusLoss: false,
        style: {
          whiteSpace: "nowrap",
        },
        autoClose: 2000,
      },
    });
  }

  if (connectingCall) {
    return <Connecting />;
  }
  if (registerCall) {
    return <Register />;
  }

  return (
    <div className="loginPage">
      <InputAndLabel
        parentCallback={handleCallback}
        className="InputAndLabel"
        labelName="Username/Email"
        inputName="username"
        type="text"
      />
      <InputAndLabel
        parentCallback={handleCallback}
        className="InputAndLabel"
        labelName="Password"
        inputName="password"
        type={"password"}
      />
      <button onClick={toggleLogin ? login : null} className="loginSubmit">
        Sign In
      </button>
      <div onClick={redirectToRegister} className="registerRedirect">
        Need an account? <span className="registerKeyword">Sign up now!</span>
      </div>
    </div>
  );
}
