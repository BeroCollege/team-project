// app/goals/[goalTitle]/page.js
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// Import styles from the existing CSS module
import styles from "../../components/Goals.module.css";
import { allGoals } from "../../data/goalsData"; // Adjust path if needed

// Define styles for task buttons (can be moved to CSS module if preferred)
const taskButtonBaseStyle = {
	color: "white",
	padding: "1rem",
	borderRadius: "12px",
	marginBottom: "1rem",
	fontWeight: "bold",
	fontSize: "1.1rem",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	cursor: "pointer",
	width: "100%",
	border: "none",
	boxShadow: "none",
	textAlign: "center",
};

const taskButtonColors = {
	0: "#2872DD", // Not Started (Blue)
	1: "#DD284A", // Skipped (Red)
	2: "#27BE1C", // Done (Green)
};

const taskButtonPrefix = {
	0: "🔵",
	1: "❌",
	2: "✔",
};

export default function GoalDetailsPage({ params }) {
	const router = useRouter();
	const [statuses, setStatuses] = useState([]);
	const [progress, setProgress] = useState(0);

	const decodedGoalTitle = params.goalTitle
		? decodeURIComponent(params.goalTitle)
		: "";

	// Find the goal data
	const currentGoal = allGoals.find(
		(goal) => goal.progressKey === decodedGoalTitle
	);
	const tasks = currentGoal?.tasks || [];
	const goalImage = currentGoal?.image || "/goals-images/default.jpeg"; // Default image

	useEffect(() => {
		if (typeof window !== "undefined" && decodedGoalTitle) {
			const storedStatuses =
				JSON.parse(localStorage.getItem(`status-${decodedGoalTitle}`)) ||
				Array(tasks.length).fill(0);
			setStatuses(storedStatuses);

			const completed = storedStatuses.filter((s) => s === 2).length;
			const initialProgress =
				tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
			setProgress(initialProgress);
			// Ensure localStorage progress is also updated on load
			localStorage.setItem(`progress-${decodedGoalTitle}`, initialProgress);
		}
	}, [decodedGoalTitle, tasks.length]);

	const updateStatus = (index) => {
		const newStatuses = [...statuses];
		newStatuses[index] = (newStatuses[index] + 1) % 3;
		setStatuses(newStatuses);
		localStorage.setItem(
			`status-${decodedGoalTitle}`,
			JSON.stringify(newStatuses)
		);

		const completed = newStatuses.filter((s) => s === 2).length;
		const newProgress =
			tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
		setProgress(newProgress);
		localStorage.setItem(`progress-${decodedGoalTitle}`, newProgress);
	};

	const renderStep = (task, index) => {
		const status = statuses[index] || 0;
		const bgColor = taskButtonColors[status];
		const prefix = taskButtonPrefix[status];

		return (
			<button
				key={index}
				onClick={() => updateStatus(index)}
				style={{
					...taskButtonBaseStyle,
					backgroundColor: bgColor,
				}}
			>
				<span>{`${prefix} ${task}`}</span>
			</button>
		);
	};

	if (!currentGoal) {
		return (
			// Use a container class, maybe from globals.css or define one
			<div className="container" style={{ paddingTop: "8rem" }}>
				<button
					onClick={() => router.back()}
					// Simple back button style (can be improved with CSS)
					style={{
						marginBottom: "1rem",
						padding: "0.5rem 1rem",
						cursor: "pointer",
					}}
				>
					← Back
				</button>
				<h1>Goal Not Found</h1>
				<p>The goal '{decodedGoalTitle}' could not be found.</p>
			</div>
		);
	}

	return (
		// Use a general container, adjust padding as needed
		// Maybe add a specific class like styles.detailsPageContainer if you add it to CSS
		<div className="container" style={{ paddingTop: "8rem" }}>
			<button
				onClick={() => router.back()}
				style={{
					background: "#eee",
					border: "none",
					borderRadius: "8px",
					padding: "0.5rem 1rem",
					fontWeight: "bold",
					cursor: "pointer",
					marginBottom: "1.5rem",
					alignSelf: "flex-start",
				}}
			>
				← Back
			</button>

			{/* Layout container for details */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "2rem",
					alignItems: "center",
					width: "100%",
					maxWidth: "800px", // Limit width for readability
					margin: "0 auto",
				}}
			>
				{/* Image and Progress Section */}
				<div style={{ width: "100%" }}>
					{/* Use styles.goalImageWrapper for consistency, but override width/aspect-ratio if needed */}
					<div
						className={styles.goalImageWrapper}
						style={{ width: "100%", height: "auto", aspectRatio: "16 / 9" }} // Adjust aspect ratio as desired
					>
						<Image
							src={goalImage}
							alt={decodedGoalTitle}
							fill
							className={styles.goalImage} // Use existing image class
							priority
						/>
					</div>

					{/* Progress Section - Reuse styles */}
					<div style={{ marginTop: "2rem" }}>
						{/* Use styles.progressText styling */}
						<p
							className={styles.progressText}
							style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }} // Override size if needed
						>
							Progress
						</p>
						{/* Use styles.progressBar styling */}
						<div
							className={styles.progressBar}
							style={{ height: "30px", backgroundColor: "#ddd", width: "100%" }} // Override height/bg if needed
						>
							{/* Use styles.progressBarInner and conditional classes */}
							<div
								className={`${styles.progressBarInner} ${
									progress === 100
										? styles.progressBarComplete
										: styles.progressBarActive // Use yellow if > 0 and < 100
								}`}
								style={{
									width: `${progress}%`,
									// Ensure background color is applied correctly
									backgroundColor:
										progress === 100
											? "#27BE1C" // Green (Complete)
											: progress > 0
											? "#FFCC00" // Yellow (Active)
											: "transparent", // No color if 0%
								}}
							></div>
						</div>
						<p
							style={{
								textAlign: "right",
								marginTop: "0.5rem",
								fontWeight: "500",
							}}
						>
							{progress}% Complete
						</p>
					</div>
				</div>

				{/* Title and Actions Section */}
				<div style={{ width: "100%" }}>
					{/* Style title like header or goalTitle */}
					<h1
						style={{
							fontSize: "2rem",
							fontWeight: "bold",
							marginBottom: "1.5rem",
							textAlign: "center",
							color: "#333", // Match goalTitle color
						}}
					>
						{decodedGoalTitle} Goal
					</h1>
					{/* Render task buttons */}
					<div>
						{tasks.length > 0 ? (
							tasks.map(renderStep)
						) : (
							<p>No tasks defined for this goal.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
