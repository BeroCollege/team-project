// app/goals/[goalTitle]/page.js
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../../components/Goals.module.css"; // Adjust path as needed
import { goalImageMap, goalTasks, allGoals } from "../../data/goalsData"; // Adjust path as needed

// Optional: Create a specific CSS module if needed
// import detailStyles from './GoalDetailsPage.module.css';

// The page component receives params object containing route parameters
export default function GoalDetailsPage({ params }) {
	const router = useRouter();
	const [statuses, setStatuses] = useState([]);
	const [progress, setProgress] = useState(0);

	// Decode the goal title from the URL parameter
	const decodedGoalTitle = params.goalTitle
		? decodeURIComponent(params.goalTitle)
		: "";

	// Find the specific goal data based on the decoded title
	const currentGoal = allGoals.find(
		(goal) => goal.progressKey === decodedGoalTitle
	);
	const tasks = currentGoal?.tasks || []; // Get tasks from the found goal or default to empty array
	const goalImage = currentGoal?.image || "/goals-images/default.jpeg"; // Use goal image or a default

	useEffect(() => {
		// Ensure localStorage is accessed only on the client side and title is valid
		if (typeof window !== "undefined" && decodedGoalTitle) {
			const storedStatuses =
				JSON.parse(localStorage.getItem(`status-${decodedGoalTitle}`)) ||
				Array(tasks.length).fill(0);
			setStatuses(storedStatuses);

			// Calculate initial progress
			const completed = storedStatuses.filter((s) => s === 2).length;
			const initialProgress =
				tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
			setProgress(initialProgress);
			// Also update localStorage progress if needed (or rely on updateStatus)
			localStorage.setItem(`progress-${decodedGoalTitle}`, initialProgress);
		}
	}, [decodedGoalTitle, tasks.length]); // Rerun if title or number of tasks changes

	const updateStatus = (index) => {
		const newStatuses = [...statuses];
		newStatuses[index] = (newStatuses[index] + 1) % 3; // cycle 0 → 1 → 2
		setStatuses(newStatuses);
		localStorage.setItem(
			`status-${decodedGoalTitle}`,
			JSON.stringify(newStatuses)
		);

		// update progress percent
		const completed = newStatuses.filter((s) => s === 2).length;
		const newProgress =
			tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
		setProgress(newProgress);
		localStorage.setItem(`progress-${decodedGoalTitle}`, newProgress);
	};

	const renderStep = (task, index) => {
		const status = statuses[index];
		let prefix = "🔵"; // Not Started
		let bgColor = "#2872DD"; // Blue

		if (status === 1) {
			prefix = "❌"; // Didn't Do / Skipped
			bgColor = "#DD284A"; // Red
		} else if (status === 2) {
			prefix = "✔"; // Done
			bgColor = "#27BE1C"; // Green
		}

		return (
			<button
				key={index}
				onClick={() => updateStatus(index)}
				style={{
					backgroundColor: bgColor,
					color: "white",
					padding: "1rem",
					borderRadius: "12px",
					marginBottom: "1rem",
					fontWeight: "bold",
					fontSize: "1.1rem", // Consider using relative units like 'rem' or 'em'
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					cursor: "pointer",
					width: "100%",
					border: "none", // Ensure no default border
					boxShadow: "none",
					textAlign: "center", // Ensure text is centered
				}}
			>
				<span>{`${prefix} ${task}`}</span>
			</button>
		);
	};

	// Handle case where goal is not found
	if (!currentGoal) {
		return (
			<div className={styles.pageContainer}>
				{" "}
				{/* Add a container */}
				<button onClick={() => router.back()} className={styles.backButton}>
					← Back
				</button>
				<h1>Goal Not Found</h1>
				<p>The goal you are looking for does not exist.</p>
			</div>
		);
	}

	return (
		// Use a container div for the page content
		// You might want a specific CSS module for page layout
		<div className={styles.pageContainer}>
			{/* Simple Back Button */}
			<button
				onClick={() => router.back()}
				style={{
					background: "#eee",
					border: "none",
					borderRadius: "8px",
					padding: "0.5rem 1rem",
					fontWeight: "bold",
					cursor: "pointer",
					marginBottom: "1.5rem", // Add some space below
					alignSelf: "flex-start", // Align to the start
				}}
			>
				← Back
			</button>

			{/* Main content area - consider using flexbox or grid for layout */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "2rem",
					alignItems: "center", // Center items horizontally
					width: "100%",
					maxWidth: "800px", // Limit max width for better readability
					margin: "0 auto", // Center the container itself
				}}
			>
				{/* Image and Progress Section */}
				<div style={{ width: "100%" }}>
					<div
						style={{
							position: "relative",
							width: "100%",
							paddingTop: "56.25%" /* 16:9 Aspect Ratio */,
						}}
					>
						<Image
							src={goalImage}
							alt={decodedGoalTitle}
							fill // Use fill for responsive images within a sized container
							style={{
								borderRadius: "15px",
								objectFit: "cover", // Cover the area
							}}
							priority // Prioritize loading if it's LCP
						/>
					</div>

					<div style={{ marginTop: "2rem" }}>
						<p
							style={{
								fontSize: "1.5rem",
								fontWeight: "bold",
								marginBottom: "0.5rem",
							}}
						>
							Progress
						</p>
						<div
							style={{
								backgroundColor: "#ddd",
								height: "30px",
								borderRadius: "8px",
								overflow: "hidden",
								width: "100%", // Ensure progress bar takes full width
							}}
						>
							<div
								style={{
									height: "100%",
									width: `${progress}%`,
									backgroundColor: progress === 100 ? "#27BE1C" : "#FFCC00", // Green when complete, Yellow otherwise
									transition: "width 0.4s ease-in-out",
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
					<h1
						style={{
							fontSize: "2rem",
							fontWeight: "bold",
							marginBottom: "1.5rem",
							textAlign: "center",
						}}
					>
						{decodedGoalTitle} Goal
					</h1>
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
