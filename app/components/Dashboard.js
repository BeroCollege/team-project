import Image from "next/image";
import DashboardWidget from "./DashboardWidget";
import MailIcon from "@/public/mail.svg";
import CalendarIcon from "@/public/calendar.svg";
import NotesIcon from "@/public/sticky_note_2.svg";
import GolfImage from "@/public/golf-stock-image.jpg"


export default function Dashboard() {
    return (
      <div className="dashboard">
        <DashboardWidget headerName={"Last Message"} icon={MailIcon} colorVar="var(--blue-messages)">
            <p className="widget-small">Anna Smith</p>
            <p className="widget-body">Hi Mary! How are you? Will you be going to the tour of TUDublin next week?</p>
        </DashboardWidget>
        <DashboardWidget headerName={"Last Note"} icon={NotesIcon} colorVar="var(--purple-notes)">
            <p className="widget-small">Friday, 28th Febraury - Ian</p>
            <p className="widget-body">Mary had a great day today. She went to TUDublin Grangegorman to do the Co-Design project with the Students. She is working in the action and Goals team. The Team were great they listened to all her ideas and Mary was happy.</p>
        </DashboardWidget>
        <DashboardWidget headerName={"Next Event"} icon={CalendarIcon} colorVar="var(--yellow-calendar)" blackText={true}>
            <p className="widget-body">Group Golf</p>
            <p className="widget-small">Monday, 3rd March 2025</p>
            <p className="widget-small">12:20pm - 1:30pm</p>
            <p className="widget-small">Celbridge</p>
            <div className="widget-notes">
              <p>Bring with me</p>
              <p>Golf Club</p>
              <p>Raincoat</p>
              <p>Lunch</p>
              <p>€10</p>
            </div>
            <div className="widget-image">
              <Image src={GolfImage} alt="Golf Stock Image" />
            </div>
        </DashboardWidget>
      </div>
    )
}