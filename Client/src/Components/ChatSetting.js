import "../Style/ChatSetting.css"
import { forwardRef, useEffect, useRef, useState } from "react";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";
import { ChatConfigContext } from "./Setting";
import { useContext } from "react";
import { Slider } from "./Slider";
import { Select } from "./Select";
import { BooleanSwitch } from "./Switch";
import axios from "axios";
import { toastSuccess, toastError } from "./Toast";
import userContext from "./userData";

export const ChatSetting = forwardRef((props, ref) => {
    const [chosenRingtone, setChosenRingtone] = useState("Default");
    const [profanity, setProfanity] = useState(false);
    const [profanityInt, setProfanityIntensity] = useState("Low");
    const settingSectionRef = [useRef(), useRef(), useRef()];
    const settingBoardRef = [useRef(), useRef(), useRef()];
    const themeRef = [useRef(), useRef(), useRef(), useRef()];
    const accentRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    const fontSizeRef = [useRef(), useRef(), useRef()];
    const fontRef = [useRef(), useRef(), useRef(), useRef()];
    const bubbleColorRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    const popupRef = [useRef(), useRef(), useRef()];
    const closeRef = useRef();
    const containerRef = useRef();
    const [Setting, setSetting] = useContext(ChatConfigContext);
    const [user, setUser] = useContext(userContext);

    const SoundOptions = ["Default", "Facebook", "Snapchat", "Microsoft Teams",
        "Kungfu Panda", "Chime", "Battlenet", "Pop", "Facebook Pop", "Cat Meow", "Whatsapp", "Invite MS",
        "Chirp", "Xylophone", "Techno", "Among Us", "Duskwood"]
    const Sounds = ['/Sounds/chat.mp3', '/Sounds/facebook_chat.mp3', '/Sounds/snapchat.mp3',
        '/Sounds/teams.mp3', '/Sounds/kung_fu_panda_chitty.mp3', '/Sounds/aol_im_chime.mp3',
        '/Sounds/battlenet_chat.mp3', '/Sounds/chat_01.mp3', '/Sounds/facebook_chat_pop.mp3',
        '/Sounds/miaou_chat.mp3', '/Sounds/tchwhatsapp.mp3', '/Sounds/invite_ms.mp3',
        '/Sounds/chat_2.mp3', '/Sounds/yeeeeeeet.mp3', '/Sounds/messenger.mp3', '/Sounds/chat_amongus.mp3'
        , '/Sounds/duskwood_chat.mp3']
    const profanityIntensity = ["Low", "Medium", "High"]


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

    function switchSettingSection(index) {
        settingBoardRef.forEach(element => {
            element.current.classList.remove("chosen");
        });
        settingBoardRef[index].current.classList.add("chosen");
    }

    async function saveSetting() {
        axios.post("https://localhost:3000/api/setting", { Setting: Setting, ID: user.ID }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            console.log(response)
            return response.data;
        }).then((data) => {
            console.log(data);
            if (data.status === 200) {
                toastSuccess("Setting saved!");
            }
            else if (data.status === 500) {
                toastError("Setting failed to save!");
            }
        }).catch((error) => {
            toastError("Setting failed to save!");
        });
    }

    function closeSetting(){
        ref.current.classList.remove("show");
    }

    // useEffect(() => {
    //     setSetting({ ...Setting, Notification: { ...Setting.Notification, Sound: chosenRingtone } });
    //     let audio = new Audio(Sounds[SoundOptions.indexOf(chosenRingtone)]);
    //     audio.play();
    // }, [chosenRingtone])

    useEffect(() => {
        if (profanity) {
            setSetting({ ...Setting, ProfanityFilter: "On" })
        }
        else {
            setSetting({ ...Setting, ProfanityFilter: "Off" })
        }
    }, [profanity])

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
        <div ref = {ref} className={`modal`}>
            <div className="settingContainer">
                <IonIcon onClick={closeSetting} icon={Icon.closeCircle} className="closeIcon"></IonIcon>
                <div className="settingSectionSlider">
                    <div onClick={event => switchSettingSection(0)} ref={settingSectionRef[0]} className="ThemeSection settingSection">Appearance</div>
                    <div onClick={event => switchSettingSection(1)} ref={settingSectionRef[1]} className="NotificationSection settingSection">Notification</div>
                    <div onClick={event => switchSettingSection(2)} ref={settingSectionRef[2]} className="LanguageSection settingSection">Language</div>
                </div>
                <div className="setting">
                    <div ref={settingBoardRef[0]} className="settingBoard ThemeBoard chosen">
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
                    <div ref={settingBoardRef[1]} className="settingBoard NotifyBoard">
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
                    <div ref={settingBoardRef[2]} className="settingBoard LanguageBoard">
                        <div className="sectionName">Language</div>
                        <div className="settingSubsection">
                            <div className="settingSubsectionName">Profanity Filter</div>
                            <div className="profanityOptions">
                                <div className="profanityOption">
                                    <div className="turnOption">Profanity Filter</div>
                                    <BooleanSwitch isTrue={profanity} setTrue={setProfanity}></BooleanSwitch>
                                </div>
                                <div className="profanityOption">
                                    <div className="profanityIntensity">Filter Intensity</div>
                                    <Select options={profanityIntensity} value={profanityIntensity} setValue={setProfanity}></Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="saveChanges" onClick={saveSetting}>Save Changes</div>
            </div>
        </div>
    </>);
}) 