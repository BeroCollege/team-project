// app/page.js
"use client";

import styles from "./page.module.css";
import globalStyles from "./globals.css";
import componentStyles from "./components/Goals.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import NavBar from "./components/NavBar";
import ProfileArea from "./components/ProfileArea";
import LogoutDialog from "./components/LogoutDialog";
import TextIncreaseIcon from "@/public/text_increase.svg";
import TextDecreaseIcon from "@/public/text_decrease.svg";
import LogoutIcon from "@/public/logout.svg";
import Goals from "./components/Goals"; // Component for the list
import GoalDetailsView from "./components/GoalDetailsView"; // New component for details

export default function Home() {
	const [fontSize, setFontSize] = useState(16);
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);
	// --- State for selected goal ---
	const [selectedGoalKey, setSelectedGoalKey] = useState(null); // null = show list, string = show details

	useEffect(() => {
		document.documentElement.style.fontSize = `${fontSize}px`;
	}, [fontSize]);

	const increaseFontSize = () => {
		setFontSize(Math.min(fontSize + 1, 28));
	};

	const decreaseFontSize = () => {
		setFontSize(Math.max(fontSize - 1, 10));
	};

	// --- Handlers for goal selection ---
	const handleGoalSelect = (goalKey) => {
		setSelectedGoalKey(goalKey);
	};

	const handleBackToList = () => {
		setSelectedGoalKey(null); // Clear selection to show the list again
	};
	// --- End Handlers ---

	return (
		<div>
			<div className="top-bar">
				<div>iplanit</div>
				<div
					className="logout"
					onClick={() => setShowLogoutDialog(true)}
					style={{ cursor: "pointer" }}
				>
					<Image src={LogoutIcon} alt="Logout Icon" width={20} height={20} />
					<a>Logout</a>
				</div>
			</div>

			<div className="container">
				<ProfileArea />
				<NavBar fontSize={fontSize} first3={true} className="first3" />
				<NavBar fontSize={fontSize} last3={true} className="last3" />

				{/* --- Conditionally render Goals list or Goal Details --- */}
				<div className={styles.mainContent}>
					{selectedGoalKey ? (
						<GoalDetailsView
							goalKey={selectedGoalKey}
							onBack={handleBackToList} // Pass the function to go back
						/>
					) : (
						<Goals onGoalSelect={handleGoalSelect} /> // Pass the selection handler
					)}
				</div>
				{/* --- End Conditional Rendering --- */}
			</div>

			<LogoutDialog
				showDialog={showLogoutDialog}
				setShowDialog={setShowLogoutDialog}
			/>
		</div>
	);
}
