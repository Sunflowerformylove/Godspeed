import { createContext, useState } from "react"

const ChatConfigContext = createContext({});
const UserConfigContext = createContext({});

export function ChatConfigProvider(props) {
    const config ={
            "Appearance": {
                "Theme": "Light", // Light, Dark, System
                "Accent": "black", // Black, Teal, Turquoise, Mint, Golden, Magenta, SlateBlue, Coral, Purple
                "Font": "Source Serif Pro",
                "FontSize": "Small",
                "FontColor": "Black",
                "BubbleColor": "Ebony",
                "BubbleOpacity": "100",
                "BubbleRadius": "10",
            },
            "Notification": {
                "Sound": "Default",
                "Popup": "Banner + Sound",
            },
            "ProfanityFilter": "Off",// Off, Weak, Strong, Strongest, Custom
            "AutoDelete": "Off", // Off, 1 Day, 1 Week, 1 Month, 1 Year, Custom
        }
    const [ChatConfig, setChatConfig] = useState(config);
    return (
        <ChatConfigContext.Provider value={[ChatConfig, setChatConfig]}>
            {props.children}
        </ChatConfigContext.Provider>
    );
}

export function UserConfigProvider(props) {
    const config = {};
    const [UserConfig, setUserConfig] = useState(config);
    return (
        <UserConfigContext.Provider value={[UserConfig, setUserConfig]}>
            {props.children}
        </UserConfigContext.Provider>
    );
}

export { ChatConfigContext, UserConfigContext };