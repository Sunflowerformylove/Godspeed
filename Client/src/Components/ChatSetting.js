import "../Style/ChatSetting.css"
import { useEffect, useRef, useState } from "react";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";
import { ChatConfigContext } from "./Setting";
import { useContext } from "react";
import { Slider } from "./Slider";
import { Select } from "./Select";
import { BooleanSwitch } from "./Switch";

export default function ChatSetting() {
    const [chosenRingtone, setChosenRingtone] = useState("Default");
    const themeRef = [useRef(), useRef(), useRef(), useRef()];
    const accentRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    const fontSizeRef = [useRef(), useRef(), useRef()];
    const fontRef = [useRef(), useRef(), useRef(), useRef()];
    const bubbleColorRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    const popupRef = [useRef(), useRef(), useRef()];
    const [Setting, setSetting] = useContext(ChatConfigContext);
    const SoundOptions = ["Default", "Facebook", "Snapchat", "Microsoft Teams",
        "Kungfu Panda", "Chime", "Battlenet", "Pop", "Facebook Pop", "Cat Meow", "Whatsapp", "Invite MS",
        "Chirp", "Xylophone", "Techno", "Among Us", "Duskwood"]
    const Sounds = ['/Sounds/chat.mp3', '/Sounds/facebook_chat.mp3', '/Sounds/snapchat.mp3',
        '/Sounds/teams.mp3', '/Sounds/kung_fu_panda_chitty.mp3', '/Sounds/aol_im_chime.mp3',
        '/Sounds/battlenet_chat.mp3', '/Sounds/chat_01.mp3', '/Sounds/facebook_chat_pop.mp3',
        '/Sounds/miaou_chat.mp3', '/Sounds/tchwhatsapp.mp3', '/Sounds/invite_ms.mp3',
        '/Sounds/chat_2.mp3', '/Sounds/yeeeeeeet.mp3', '/Sounds/messenger.mp3', '/Sounds/chat_amongus.mp3'
        , '/Sounds/duskwood_chat.mp3']

    function selectTheme(index) {
        themeRef.forEach(element => {
            element.current.querySelector(".isChosen").classList.remove("chosen");
        });
        themeRef[index].current.querySelector(".isChosen").classList.add("chosen");
        setSetting({ ...Setting, Appearance: { ...Setting.Appearance, Theme: themeRef[index].current.querySelector(".themeName").innerHTML } });
    }

    function selectAccent(index) {
        accentRef.forEach(element => {
            element.current.classList.remove("chosen");
        });
        accentRef[index].current.classList.add("chosen");
        setSetting({
            ...Setting, Appearance: {
                ...Setting.Appearance, Accent: accentRef[index].current.classList[1],
                BubbleColor: accentRef[index].current.classList[1]
            }
        });
        if (accentRef[index].current.classList[1] === "black") {
            setSetting({ ...Setting, Appearance: { ...Setting.Appearance, FontColor: "White" } });
        }
        else {
            setSetting({ ...Setting, Appearance: { ...Setting.Appearance, FontColor: "Black" } });
        }
    }

    function selectFontSize(index) {
        fontSizeRef.forEach(element => {
            element.current.querySelector(".isChosen").classList.remove("chosen");
        });
        fontSizeRef[index].current.querySelector(".isChosen").classList.add("chosen");
        setSetting({ ...Setting, Appearance: { ...Setting.Appearance, Font: fontSizeRef[index].current.querySelector(".fontName").innerHTML } });
    }

    function selectFont(index) {
        fontRef.forEach(element => {
            element.current.querySelector(".isChosen").classList.remove("chosen");
        });
        fontRef[index].current.querySelector(".isChosen").classList.add("chosen");
        setSetting({ ...Setting, Appearance: { ...Setting.Appearance, FontSize: fontRef[index].current.querySelector(".fontName").innerHTML } });
    }

    function selectBubbleColor(index) {
        bubbleColorRef.forEach(element => {
            element.current.classList.remove("chosen");
        });
        bubbleColorRef[index].current.classList.add("chosen");
        setSetting({ ...Setting, Appearance: { ...Setting.Appearance, BubbleColor: bubbleColorRef[index].current.innerHTML } });
    }

    function selectPopup(index) {
        popupRef.forEach(element => {
            element.current.querySelector(".isChosen").classList.remove("chosen");
        });
        popupRef[index].current.querySelector(".isChosen").classList.add("chosen");
        setSetting({ ...Setting, Notification: { ...Setting.Notification, Popup: popupRef[index].current.querySelector(".popupName").innerHTML } });
    }

    // useEffect(() => {
    //     setSetting({ ...Setting, Notification: { ...Setting.Notification, Sound: chosenRingtone } });
    //     let audio = new Audio(Sounds[SoundOptions.indexOf(chosenRingtone)]);
    //     audio.play();
    // }, [chosenRingtone])

    useEffect(() => {
        accentRef.forEach(element => {
            element.current.classList.remove("chosen");
            if (element.current.classList[1] === Setting.Appearance.Accent) {
                element.current.classList.add("chosen");
            }
        });
        themeRef.forEach(element => {
            element.current.querySelector(".isChosen").classList.remove("chosen");
            if (element.current.querySelector(".themeName").innerHTML === Setting.Appearance.Theme) {
                element.current.querySelector(".isChosen").classList.add("chosen");
            }
        });
        fontSizeRef.forEach(element => {
            element.current.querySelector(".isChosen").classList.remove("chosen");
            if (element.current.querySelector(".fontName").innerHTML === Setting.Appearance.FontSize) {
                element.current.querySelector(".isChosen").classList.add("chosen");
            }
        });
        fontRef.forEach(element => {
            element.current.querySelector(".isChosen").classList.remove("chosen");
            if (element.current.querySelector(".fontName").innerHTML === Setting.Appearance.Font) {
                element.current.querySelector(".isChosen").classList.add("chosen");
            }
        });
        bubbleColorRef.forEach(element => {
            element.current.classList.remove("chosen");
            if (element.current.innerHTML === Setting.Appearance.BubbleColor) {
                element.current.classList.add("chosen");
            }
        });
    }, []);

    return (<>
        <div className="modal">
            <div className="settingContainer">
                <IonIcon icon={Icon.closeCircle} className="closeIcon"></IonIcon>
                <div className="settingSectionSlider">
                    <div className="ThemeSection settingSection">Appearance</div>
                    <div className="NotificationSection settingSection">Notification</div>
                    <div className="LanguageSection settingSection">Language</div>
                </div>
                <div className="setting">
                    <div className="settingBoard ThemeBoard">
                        <div className="sectionName">Appearance</div>
                        <div className="settingOption AccentAndTheme">
                            <div className="settingSubsection">
                                <div className="settingSubsectionName">Accent</div>
                                <div className="accentOptions">
                                    <div ref={accentRef[0]} onClick={event => selectAccent(0)} className="accentOption black"></div>
                                    <div ref={accentRef[1]} onClick={event => selectAccent(1)} className="accentOption teal"></div>
                                    <div ref={accentRef[2]} onClick={event => selectAccent(2)} className="accentOption turquoise"></div>
                                    <div ref={accentRef[3]} onClick={event => selectAccent(3)} className="accentOption mint"></div>
                                    <div ref={accentRef[4]} onClick={event => selectAccent(4)} className="accentOption golden"></div>
                                    <div ref={accentRef[5]} onClick={event => selectAccent(5)} className="accentOption magenta"></div>
                                    <div ref={accentRef[6]} onClick={event => selectAccent(6)} className="accentOption slateBlue"></div>
                                    <div ref={accentRef[7]} onClick={event => selectAccent(7)} className="accentOption coral"></div>
                                    <div ref={accentRef[8]} onClick={event => selectAccent(8)} className="accentOption purple"></div>
                                </div>
                            </div>
                            <div className="settingSubsection">
                                <div className="settingSubsectionName">Theme</div>
                                <div className="themeOptions">
                                    <div onClick={event => selectTheme(0)} ref={themeRef[0]} className="themeOption dark">
                                        <div className="isChosen"></div>
                                        <div className="themeName">Dark</div>
                                    </div>
                                    <div ref={themeRef[1]} onClick={event => selectTheme(1)} className="themeOption light">
                                        <div className="isChosen"></div>
                                        <div className="themeName">Light</div>
                                    </div>
                                    <div ref={themeRef[2]} onClick={event => selectTheme(2)} className="themeOption sunset">
                                        <div className="isChosen"></div>
                                        <div className="themeName">Sunset</div>
                                    </div>
                                    <div ref={themeRef[3]} onClick={event => selectTheme(3)} className="themeOption system">
                                        <div className="isChosen"></div>
                                        <div className="themeName">System</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="settingOption Font">
                            <div className="settingSubsection">
                                <div className="settingSubsectionName">Font Size</div>
                                <div className="fontSizeOptions">
                                    <div ref={fontSizeRef[0]} onClick={event => selectFontSize(0)} className="fontSizeOption">
                                        <div className="isChosen"></div>
                                        <div className="fontName small">Small</div>
                                    </div>
                                    <div ref={fontSizeRef[1]} onClick={event => selectFontSize(1)} className="fontSizeOption">
                                        <div className="isChosen"></div>
                                        <div className="fontName medium">Medium</div>
                                    </div>
                                    <div ref={fontSizeRef[2]} onClick={event => selectFontSize(2)} className="fontSizeOption">
                                        <div className="isChosen"></div>
                                        <div className="fontName large">Large</div>
                                    </div>
                                </div>
                            </div>
                            <div className="settingSubsection">
                                <div className="settingSubsectionName">Font</div>
                                <div className="fontOptions">
                                    <div ref={fontRef[0]} onClick={event => selectFont(0)} className="fontOption">
                                        <div className="isChosen"></div>
                                        <div className="fontName">Roboto</div>
                                    </div>
                                    <div ref={fontRef[1]} onClick={event => selectFont(1)} className="fontOption">
                                        <div className="isChosen"></div>
                                        <div className="fontName">Open Sans</div>
                                    </div>
                                    <div ref={fontRef[2]} onClick={event => selectFont(2)} className="fontOption">
                                        <div className="isChosen"></div>
                                        <div className="fontName">Source Serif Pro</div>
                                    </div>
                                    <div ref={fontRef[3]} onClick={event => selectFont(3)} className="fontOption">
                                        <div className="isChosen"></div>
                                        <div className="fontName">Montserrat</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="settingOption Bubble">
                            <div className="settingSubsection">
                                <div className="settingSubsectionName">Bubble Radius</div>
                                <Slider min={"1"} max={"50"} mode={"Percentage"} value={Setting.Appearance.BubbleRadius} usage={"BubbleRadius"}></Slider>
                            </div>
                            <div className="settingSubsection">
                                <div className="settingSubsectionName">Bubble Color</div>
                                <div className="bubbleColorOptions">
                                    <div ref={bubbleColorRef[0]} onClick={event => selectBubbleColor(0)} className="bubbleColor apple">Candy Apple</div>
                                    <div ref={bubbleColorRef[1]} onClick={event => selectBubbleColor(1)} className="bubbleColor arctic">Arctic</div>
                                    <div ref={bubbleColorRef[2]} onClick={event => selectBubbleColor(2)} className="bubbleColor seaFoam">Sea Foam</div>
                                    <div ref={bubbleColorRef[3]} onClick={event => selectBubbleColor(3)} className="bubbleColor orange">Orange</div>
                                    <div ref={bubbleColorRef[4]} onClick={event => selectBubbleColor(4)} className="bubbleColor ebony">Ebony</div>
                                    <div ref={bubbleColorRef[5]} onClick={event => selectBubbleColor(5)} className="bubbleColor lilac">Lilac</div>
                                </div>
                            </div>
                            <div className="settingSubsection">
                                <div className="settingSubsectionName">Bubble Opacity</div>
                                <Slider min={"1"} max={"100"} mode={"Decimal"} value={Setting.Appearance.BubbleOpacity} usage={"BubbleOpacity"}></Slider>
                            </div>
                        </div>
                    </div>
                    <div className="settingBoard NotifyBoard">
                        <div className="sectionName">Notification</div>
                        <div className="settingSubsection" style={{ "height": "20%" }}>
                            <div className="settingSubsectionName">Sound</div>
                            <div className="soundOptions">
                                <Select options={SoundOptions} value={chosenRingtone} setValue={setChosenRingtone}></Select>
                            </div>
                        </div>
                        <div className="settingSubsection">
                            <div className="settingSubsectionName">Popup</div>
                            <div className="popupOptions">
                                <div onClick={event => selectPopup(0)} className="popupOption" ref={popupRef[0]}>
                                    <div className="isChosen"></div>
                                    <div className="popupName">Banner Only</div>
                                </div>
                                <div onClick={event => selectPopup(1)} className="popupOption" ref={popupRef[1]}>
                                    <div className="isChosen"></div>
                                    <div className="popupName">Sound Only</div>
                                </div>
                                <div onClick={event => selectPopup(2)} className="popupOption" ref={popupRef[2]}>
                                    <div className="isChosen"></div>
                                    <div className="popupName">Banner + Sound</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="settingBoard LanguageBoard">
                        <div className="sectionName">Language</div>
                        <div className="settingSubsection">
                            <div className="settingSubsectionName">Profanity Filter</div>
                            <div className="profanityOptions">
                                <div className="profanityOption">
                                    <div className="turnOption">Profanity Filter</div>
                                    <BooleanSwitch></BooleanSwitch>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}