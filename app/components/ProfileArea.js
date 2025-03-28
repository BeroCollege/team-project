import Image from "next/image";
import ProfilePic from "@/public/profile_placeholder.png";
import PersonIcon from "@/public/person.svg";
import LogoutIcon from "@/public/logout.svg";

export default function ProfileArea() {
    // Missing function logic

    return (
        <div className="profile-area">
            <div className="profile-circle">
                <Image src={ProfilePic} alt="Profile image placeholder" />
                <div className="icon">
                    <Image src={PersonIcon} alt="Person icon" />
                </div>
            </div>
            <div className="profile-area-name">
                <a href="#">Patrick</a>
            </div>

            {/* <div className="profile-area-btns">
              <button className="smaller" onClick={decreaseFontSize}>
                <Image src={TextDecreaseIcon} alt="Text Decrease Icon" />
              </button>
              <button onClick={increaseFontSize}>
                <Image src={TextIncreaseIcon} alt="Text Increase Icon" />
              </button>
            </div> */}
        </div>
    )
}