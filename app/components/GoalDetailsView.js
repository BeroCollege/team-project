// app/components/GoalDetailsView.js
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
// --- Import the CSS module ---
import styles from "./Goals.module.css";

// Task button styles/constants
const taskButtonBaseStyle = {
	color: "white",
	padding: "1.2rem 1rem",
	borderRadius: "12px",
	marginBottom: "1rem",
	fontWeight: "bold",
	fontSize: "1.2rem",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "0.8rem",
	cursor: "pointer",
	width: "100%",
	border: "none",
	boxShadow: "none",
	textAlign: "center",
};
const taskButtonColors = { 0: "#2872DD", 1: "#DD284A", 2: "#27BE1C" };
const taskButtonPrefix = { 0: "🔵", 1: "❌", 2: "✔" };

export default function GoalDetailsView({ goal, onBack, onGoalUpdate }) {
	// console.log("GoalDetailsView: Received goal prop:", goal); // Keep for debugging if needed

	// State variables
	const [statuses, setStatuses] = useState(goal?.taskStatuses || []);
	const [progress, setProgress] = useState(goal?.progress || 0);
	const [isUpdating, setIsUpdating] = useState(false);
	const [updateError, setUpdateError] = useState(null);

	// Derived variables
	const tasks = goal?.tasks || [];
	// console.log("GoalDetailsView: Derived tasks:", tasks); // Keep for debugging if needed
	const goalImage = goal?.image || "/goals-images/default.jpeg";
	const goalTitle = goal?.title || "Goal Details";
	const goalKey = goal?.progressKey;

	// Effect to sync local state with prop changes
	useEffect(() => {
		setStatuses(goal?.taskStatuses || []);
		setProgress(goal?.progress || 0);
	}, [goal]);

	// Function to update task status via API
	const updateStatus = async (index) => {
		if (!goalKey || typeof index !== "number" || isUpdating) return;

		const currentStatus = statuses[index] ?? 0;
		const newStatus = (currentStatus + 1) % 3;

		setIsUpdating(true);
		setUpdateError(null);

		try {
			const response = await fetch(`/api/goals/${goalKey}/tasks/${index}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ newStatus }),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					`API error! status: ${response.status} - ${
						errorData.message || "Failed to update"
					}`
				);
			}

			const updatedData = await response.json();

			// Update local state based on API response
			setStatuses(updatedData.taskStatuses);
			setProgress(updatedData.progress);

			// Notify parent component
			if (onGoalUpdate) {
				onGoalUpdate(updatedData);
			}
		} catch (error) {
			console.error("Failed to update task status:", error);
			setUpdateError(error.message || "Could not update task.");
		} finally {
			setIsUpdating(false);
		}
	};

	// --- *** RESTORED renderStep IMPLEMENTATION *** ---
	const renderStep = (task, index) => {
		const status = statuses[index] ?? 0; // Use local state, default to 0
		const bgColor = taskButtonColors[status];
		const prefix = taskButtonPrefix[status];

		// Return the button JSX
		return (
			<button
				key={index} // Key is important for lists
				onClick={() => updateStatus(index)}
				style={{ ...taskButtonBaseStyle, backgroundColor: bgColor }}
				disabled={isUpdating} // Disable button while updating
			>
				<span>{`${prefix} ${task}`}</span>
			</button>
		);
	};
	// --- *** END RESTORED IMPLEMENTATION *** ---

	if (!goal) {
		return (
			<div className={styles.goalsContainer}>
				<button onClick={onBack} className={styles.backButton}>
					← Back
				</button>
				<h1>Goal data not available.</h1>
			</div>
		);
	}

	return (
		<div className={styles.goalsContainer}>
			<button onClick={onBack} className={styles.backButton}>
				← Back
			</button>

			{updateError && (
				<p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>
					Error: {updateError}
				</p>
			)}

			<div
				style={{
					display: "flex",
					flexDirection: "row",
					gap: "2rem",
					width: "100%",
				}}
			>
				{/* Left Column */}
				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						gap: "1.5rem",
					}}
				>
					<div
						className={styles.goalImageWrapper}
						style={{
							width: "100%",
							height: "auto",
							aspectRatio: "4 / 3",
							position: "relative",
						}}
					>
						<Image
							src={goalImage}
							alt={goalTitle}
							fill
							className={styles.goalImage}
							priority
						/>
					</div>
					<div
						className={styles.progressBox}
						style={{ width: "100%", padding: "1rem" }}
					>
						<span className={styles.progressText}>Progress</span>
						<div className={styles.progressBar} style={{ width: "95%" }}>
							<div
								className={`${styles.progressBarInner} ${
									progress === 100
										? styles.progressBarComplete
										: progress > 0
										? styles.progressBarActive
										: ""
								}`}
								style={{ width: `${progress}%` }}
							></div>
						</div>
					</div>
				</div>
				{/* Right Column */}
				<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
					<h1
						style={{
							fontSize: "2rem",
							fontWeight: "bold",
							marginBottom: "1.5rem",
							textAlign: "center",
							color: "#333",
						}}
					>
						{goalTitle} Goal
					</h1>
					{/* Container for task buttons */}
					<div>
						{tasks.length > 0 ? (
							tasks.map(renderStep) // This will now call the implemented function
						) : (
							<p>No tasks defined for this goal.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
