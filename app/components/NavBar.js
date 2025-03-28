"use client";
// import styles from "./NavBar.module.css";
import { useState, useEffect } from "react";
import NavBtn from "./NavBtn";
import MailIcon from "@/public/mail.svg";
import MediaIcon from "@/public/photo_camera.svg";
import CalendarIcon from "@/public/calendar.svg";
import PlanIcon from "@/public/edit.svg";
import ActionsIcon from "@/public/event_lists.svg";
import NotesIcon from "@/public/sticky_note_2.svg";


export default function NavBar({ fontSize, first3, last3, all }) {
    const [singleCol, setSingleCol] = useState(false);

    useEffect(() => {
        console.log("triggered fontsize change");
        
        if (fontSize >= 18) {
            setSingleCol(true)
        } else {
            setSingleCol(false)
        }
    }, [fontSize])

    return (
        <div className={`navbar ${singleCol ? "single-col" : ""} ${first3 ? "first3" : ""} ${last3 ? "last3" : ""}`}>
            {(first3 || all) && (
                <>
                {/* <p>What is happening?</p> */}
                <NavBtn btnName={"Messages"} icon={MailIcon} colorVar="var(--blue-messages)" />
                <NavBtn btnName={"Media"} icon={MediaIcon} colorVar="var(--orange-media)" />
                <NavBtn btnName={"Calendar"} icon={CalendarIcon} colorVar="var(--yellow-calendar)" blackText={true} />
                </>
            )}
            {/* {(last3 || all) && ( */}
                {/* <> */}
                <NavBtn btnName={"Plan"} icon={PlanIcon} colorVar="var(--pink-plan)" />
                <NavBtn btnName={"Actions"} icon={ActionsIcon} colorVar="var(--green-actions)" />
                <NavBtn btnName={"Notes"} icon={NotesIcon} colorVar="var(--purple-notes)" />
                {/* </> */}
            {/* )} */}
        </div>
    );
    
}