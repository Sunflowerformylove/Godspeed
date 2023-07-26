import "../Style/ChatSetting.css"
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";

let Setting = {
    // Chat Setting
    "Theme": {
        "Color": "Light", // Light, Dark, System
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

export default function ChatSetting() {

    return (<>
        <div className="modal">
            <div className="setting">
                <IonIcon icon={Icon.closeCircle} className="closeIcon"></IonIcon>
                <div className="settingSectionSlider">
                    <div className="ThemeSection settingSection">Appearance</div>
                    <div className="NotificationSection settingSection">Notification</div>
                    <div className="LanguageSection settingSection">Language</div>
                </div>
                <div className="setting">
                    <div className="settingBoard ThemeBoard">
                        <div className="currentSectionName">Appearance</div>
                        <div className="settingOption AccentAndTheme">
                            <div className="settingSubsection">
                                <div className="settingSubsectionName">Accent</div>
                                <div className="accentOptions">
                                    <div className="accentOption"></div>
                                </div>
                            </div>
                        </div>
                        <div className="settingOption">
                            <div className="settingDescription"></div>
                            <div className="switch"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}