import { createContext, useState } from "react"

const ChatConfigContext = createContext({});
const UserConfigContext = createContext({});

export function ChatConfigProvider(props) {
    const config ={
            "Appearance": {
                "Theme": "Light", // Light, Dark, System
                "Accent": "Black", // Black, Teal, Turquoise, Mint, Golden, Magenta, SlateBlue, Coral, Purple
                "Wallpaper": "None", // None, Image, Presets
                "Emoji": "Like",
                "Font": "Source Serif Pro",
                "FontSize": "16px",
                "FontColor": "Black",
                "FontWeight": "400",
                "Bubble": "Rounded", // Rounded, Square, Circle, None
                "BubbleColor": "#c9c9c9",
                "BubbleOpacity": "1",
                "BubbleRadius": "10px",
            },
            "Notification": {
                "Sound": "Default",
                "Popup": "Default",
                "Preview": "Default",
                "Priority": "Default",
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