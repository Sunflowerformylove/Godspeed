import Welcome from './Components/Welcome';
import './App.css';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Chat from './Components/Chat';

export default function App() {
    const [chatCall, setChatCall] = useState(false);
    useEffect(() => {
        if(Cookies.get('userSession') !== undefined){
            axios({
                method: 'POST',
                url: 'http://localhost:3000/checkSession',
                data: JSON.stringify({userSession: Cookies.get('userSession')}),
                headers: { 'Content-Type': 'application/json'},
            }).then(response => response.data)
            .then(data => {
              if(data.accept === true){
                setChatCall(true);
              }
            });
        }
      },[]);
    return (
    <>  
        {chatCall ? <Chat/>:<Welcome/>}
    </>
    )
}