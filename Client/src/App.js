import Welcome from "./Components/Welcome";
import "./App.css";
import { setupIonicReact } from '@ionic/react';
import { UserProvider } from "./Components/userData";
setupIonicReact();

export default function App() {
  return (
    <UserProvider>
      <Welcome />
    </UserProvider>
  )
}
