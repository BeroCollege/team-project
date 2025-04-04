// app/page.js (Correct Version)
"use client";

import styles from "./page.module.css";
import globalStyles from "./globals.css"; // Assuming globals are loaded
import { useEffect, useState } from "react";
import Image from "next/image";
import NavBar from "./components/NavBar";
import ProfileArea from "./components/ProfileArea";
import LogoutDialog from "./components/LogoutDialog";
import TextIncreaseIcon from "@/public/text_increase.svg";
import TextDecreaseIcon from "@/public/text_decrease.svg";
import LogoutIcon from "@/public/logout.svg";
import Goals from "./components/Goals"; // Component for the list
import GoalDetailsView from "./components/GoalDetailsView"; // Component for details

export default function Home() {
	const [fontSize, setFontSize] = useState(16);
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);

	// --- State for selected goal ---
	// Store the full goal object when selected
	const [selectedGoalData, setSelectedGoalData] = useState(null); // <-- Changed state

	useEffect(() => {
		document.documentElement.style.fontSize = `${fontSize}px`;
	}, [fontSize]);

	const increaseFontSize = () => setFontSize(Math.min(fontSize + 1, 28));
	const decreaseFontSize = () => setFontSize(Math.max(fontSize - 1, 10));

	// --- Handler for when a goal is selected in the Goals list ---
	// Accepts the full goal object from Goals.js
	const handleGoalSelect = (goalData) => {
		console.log("page.js: Received goal data:", goalData);
		setSelectedGoalData(goalData); // <-- Sets the object state
	};

	// --- Handler to go back to the Goals list ---
	const showGoalsList = () => {
		setSelectedGoalData(null); // Clear selection object
	};

	// --- Handler for when a goal is updated in GoalDetailsView ---
	// Receives the updated data object from the API response via GoalDetailsView
	const handleGoalUpdate = (updatedGoalData) => {
		// Update the state here so GoalDetailsView gets the latest data via props
		setSelectedGoalData((prevData) => ({
			...(prevData || {}), // Keep existing static data (like id, title, image, tasks)
			// Update only the dynamic parts received from API
			progress: updatedGoalData.progress,
			taskStatuses: updatedGoalData.taskStatuses,
		}));
		// Note: This doesn't update the main Goals list automatically yet.
		// The list will refresh its data when the category changes or on next load.
	};

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
				{/* Pass showGoalsList down if NavBar needs to trigger going back */}
				<NavBar
					fontSize={fontSize}
					first3={true}
					className="first3"
					onShowGoalsList={showGoalsList} // Assuming NavBar uses this
				/>
				<NavBar
					fontSize={fontSize}
					last3={true}
					className="last3"
					onShowGoalsList={showGoalsList} // Assuming NavBar uses this
				/>

				{/* --- Conditionally render Goals list or Goal Details --- */}
				<div className={styles.mainContent}>
					{selectedGoalData ? ( // Render details if a goal object is selected
						<GoalDetailsView
							goal={selectedGoalData} // <-- Pass the full goal object
							onBack={showGoalsList} // Pass the function to go back
							onGoalUpdate={handleGoalUpdate} // <-- Pass the update handler
						/>
					) : (
						<Goals onGoalSelect={handleGoalSelect} /> // Pass the selection handler
					)}
				</div>
			</div>

			<LogoutDialog
				showDialog={showLogoutDialog}
				setShowDialog={setShowLogoutDialog}
			/>
		</div>
	);
}
