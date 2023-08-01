import "../Style/ChatSetting.css"
import { useEffect, useRef } from "react";
import { IonIcon } from "@ionic/react";
import * as Icon from "ionicons/icons";
import { ChatConfigContext } from "./Setting";
import { useContext } from "react";

export default function ChatSetting() {
    const themeRef = [useRef(), useRef(), useRef(), useRef()];
    const accentRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    const Setting = useContext(ChatConfigContext);

    function selectTheme(index) {
        themeRef.forEach(element => {
            element.current.querySelector(".isChosen").classList.remove("chosen");
        });
        themeRef[index].current.querySelector(".isChosen").classList.add("chosen");
        Setting.Appearance.Theme = themeRef[index].current.querySelector(".themeName").innerHTML;
    }

    function selectAccent(index) {
        accentRef.forEach(element => {
            element.current.classList.remove("chosen");
        });
        accentRef[index].current.classList.add("chosen");
        Setting.Appearance.Accent = accentRef[index].current.classList[1];
    }

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
                                    <div ref = {accentRef[0]} onClick = {event => selectAccent(0)} className="accentOption black"></div>
                                    <div ref = {accentRef[1]} onClick = {event => selectAccent(1)} className="accentOption teal"></div>
                                    <div ref = {accentRef[2]} onClick = {event => selectAccent(2)} className="accentOption turquoise"></div>
                                    <div ref = {accentRef[3]} onClick = {event => selectAccent(3)} className="accentOption mint"></div>
                                    <div ref = {accentRef[4]} onClick = {event => selectAccent(4)} className="accentOption golden"></div>
                                    <div ref = {accentRef[5]} onClick = {event => selectAccent(5)} className="accentOption magenta"></div>
                                    <div ref = {accentRef[6]} onClick = {event => selectAccent(6)} className="accentOption slateBlue"></div>
                                    <div ref = {accentRef[7]} onClick = {event => selectAccent(7)} className="accentOption coral"></div>
                                    <div ref = {accentRef[8]} onClick = {event => selectAccent(8)} className="accentOption purple"></div>
                                </div>
                            </div>
                            <div className="settingSubsection">
                                <div className="settingSubsectionName">Theme</div>
                                <div className="themeOptions">
                                    <div onClick={event => selectTheme(0)} ref = {themeRef[0]} className="themeOption dark">
                                        <div className="isChosen chosen"></div>
                                        <div className="themeName">Dark</div>
                                    </div>
                                    <div ref = {themeRef[1]} onClick={event => selectTheme(1)} className="themeOption light">
                                        <div className="isChosen"></div>
                                        <div className="themeName">Light</div>
                                    </div>
                                    <div ref = {themeRef[2]} onClick={event => selectTheme(2)} className="themeOption sunset">
                                        <div className="isChosen"></div>
                                        <div className="themeName">Sunset</div>
                                    </div>
                                    <div ref = {themeRef[3]} onClick={event => selectTheme(3)} className="themeOption system">
                                        <div className="isChosen"></div>
                                        <div className="themeName">System</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="settingOption Theme">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}