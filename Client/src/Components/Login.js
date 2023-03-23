import InputAndLabel from "./Input";
import { useState, useRef } from "react";
import {toast} from 'react-toastify'
import { toastSuccess, toastError, toastPromise } from "./Toast";
import Chat from "./Chat";
import "../Style/Login.css";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [chatCall, setChatCall] = useState(false);

  function handleCallback(name, childData) {
    setForm({ ...form, [name]: childData });
  }

  function login() {
    // const loading = toast.loading("Signing in...");
    let formData = { user: form };
    toastPromise(
    fetch("http://localhost:3000/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then(response => {
      if(!response.ok){
        throw new Error('Login failed!');
      }
        return response.json();
      }).then(data => {
        if(data.errorCode === 1){
          throw new Error('Username/Password is incorrect!');
        }
        else if(data.errorCode === 2){
          throw new Error('Field(s) required!');
        }
        return data;
      }), "Signing in...",(data) => {return `Welcome ${data.username}`}, (error) => error.message
    )
    // .then(response=> {
    //   return response.json();
    // })
    // .then(data => {
    //   console.log(data);
    //   if(data.errorCode === 1){
    //     toast.update(loading,{render: "Username/Password is incorrect", type: "error", isLoading: false, autoClose: 2000});
    //   }
    //   else if(data.errorCode === 2){
    //     toast.update(loading,{render: "Field(s)'s required!", type: "error", isLoading: false, autoClose: 2000});
    //   }
    //   else if(data.errorCode === 0){
    //     toast.update(loading,{render: `Welcome ${data.user}`, type: "success", isLoading: false,autoClose: 2000, onClose: (() => {
    //       setChatCall(true);
    //     })});
    //   }
    // })
    // )
  }

  if(chatCall){
    return (<Chat/>);
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
      <button onClick = {login} className="loginSubmit">Sign In</button>
      <div className="registerRedirect">
        Need an account? <span className="registerKeyword">Sign up now!</span>
      </div>
    </div>
  );
}
