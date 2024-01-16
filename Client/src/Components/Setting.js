import { createContext, useState } from "react"

const ChatConfigContext = createContext({});
const UserConfigContext = createContext({});

export function ChatConfigProvider(props) {
    const config ={
            "Appearance": {
                "Theme": "Dark", // Light, Dark, System
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
            "ProfanityFilter": "false",// Off, Weak, Strong, Strongest, Custom
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