import Image from "next/image";
import LogoutIcon from "@/public/logout.svg";
import CloseIcon from "@/public/close.svg";
import BackIcon from "@/public/arrow_back.svg";
import WaveIcon from "@/public/waving_hand.svg";


export default function LogoutDialog({ showDialog, setShowDialog }) {
    const logoutLogic = () => {
        alert("Logged out!")
        setShowDialog(false)
    }

    return (
    <>
    {showDialog && (
        <div className="dialog-bg" onClick={() => setShowDialog(false)}>
            <div className="dialog-box" onClick={e => e.stopPropagation()}>
                <button className="close-icon" onClick={() => setShowDialog(false)}>
                    <Image src={CloseIcon} alt="Close Icon" />
                </button>
                <p className="title">
                    <span className="logout-icon"><Image src={LogoutIcon} alt="LogoutIcon" /></span>
                    Do you want to leave?
                </p>
                <div className="dialog-buttons">
                    <button className="no" onClick={() => setShowDialog(false)}>
                        <span><Image src={BackIcon} alt="Back Arrow Icon"/></span>
                        No, Go back
                    </button>
                    <button className="yes" onClick={() => logoutLogic()}>
                        <span><Image src={WaveIcon} alt="Waving Hand Icon"/></span>
                        Yes, Bye
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
    )
}