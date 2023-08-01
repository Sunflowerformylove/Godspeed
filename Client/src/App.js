import Welcome from "./Components/Welcome";
import "./App.css";
import { setupIonicReact } from '@ionic/react';
import { UserProvider } from "./Components/userData";
import { ChatConfigProvider, UserConfigProvider } from "./Components/Setting";
setupIonicReact();

export default function App() {
  return (
    <UserProvider>
      <ChatConfigProvider>
        <UserConfigProvider>
          <Welcome />
        </UserConfigProvider>
      </ChatConfigProvider>
    </UserProvider>
  )
}
