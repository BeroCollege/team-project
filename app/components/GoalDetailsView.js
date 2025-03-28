// app/components/GoalDetailsView.js
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Goals.module.css"; // Reuse the same CSS module
import { allGoals } from "../data/goalsData"; // Adjust path if needed

// Task button styles - Adjusted padding and font size
const taskButtonBaseStyle = {
	color: "white",
	padding: "1.2rem 1rem", // Increased vertical padding for more height
	borderRadius: "12px",
	marginBottom: "1rem",
	fontWeight: "bold",
	fontSize: "1.2rem", // Slightly increased font size
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

export default function GoalDetailsView({ goalKey, onBack }) {
	const [statuses, setStatuses] = useState([]);
	const [progress, setProgress] = useState(0);

	const currentGoal = allGoals.find((goal) => goal.progressKey === goalKey);
	const tasks = currentGoal?.tasks || [];
	const goalImage = currentGoal?.image || "/goals-images/default.jpeg";
	const goalTitle = currentGoal?.title || "Goal Details";

	useEffect(() => {
		if (typeof window !== "undefined" && goalKey) {
			const storedStatuses =
				JSON.parse(localStorage.getItem(`status-${goalKey}`)) ||
				Array(tasks.length).fill(0);
			setStatuses(storedStatuses);

			const completed = storedStatuses.filter((s) => s === 2).length;
			const initialProgress =
				tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
			setProgress(initialProgress);
			localStorage.setItem(`progress-${goalKey}`, initialProgress);
		} else if (!goalKey) {
			setStatuses([]);
			setProgress(0);
		}
	}, [goalKey, tasks.length]);

	const updateStatus = (index) => {
		const newStatuses = [...statuses];
		newStatuses[index] = (newStatuses[index] + 1) % 3;
		setStatuses(newStatuses);
		localStorage.setItem(`status-${goalKey}`, JSON.stringify(newStatuses));

		const completed = newStatuses.filter((s) => s === 2).length;
		const newProgress =
			tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
		setProgress(newProgress);
		localStorage.setItem(`progress-${goalKey}`, newProgress);
	};

	const renderStep = (task, index) => {
		const status = statuses[index] || 0;
		const bgColor = taskButtonColors[status];
		const prefix = taskButtonPrefix[status];

		return (
			<button
				key={index}
				onClick={() => updateStatus(index)}
				style={{ ...taskButtonBaseStyle, backgroundColor: bgColor }}
			>
				<span>{`${prefix} ${task}`}</span>
			</button>
		);
	};

	if (!currentGoal) {
		return (
			<div className={styles.goalsContainer}>
				<button
					onClick={onBack}
					style={{
						// Adjusted Back Button Styles
						background: "#ddd", // Lighter grey
						color: "#333", // Darker text
						border: "none",
						borderRadius: "10px", // Slightly larger radius
						padding: "0.8rem 1.8rem", // Increased padding
						fontSize: "1.1rem", // Slightly larger font
						fontWeight: "bold",
						cursor: "pointer",
						marginBottom: "1.5rem",
						alignSelf: "flex-start",
					}}
				>
					← Back
				</button>
				<h1>Goal Not Found</h1>
			</div>
		);
	}

	return (
		<div className={styles.goalsContainer}>
			<button
				onClick={onBack}
				style={{
					// Adjusted Back Button Styles
					background: "#ddd", // Lighter grey
					color: "#333", // Darker text
					border: "none",
					borderRadius: "10px", // Slightly larger radius
					padding: "0.8rem 1.8rem", // Increased padding
					fontSize: "1.1rem", // Slightly larger font
					fontWeight: "bold",
					cursor: "pointer",
					marginBottom: "1.5rem",
					alignSelf: "flex-start",
				}}
			>
				← Back
			</button>

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

					{/* Progress Box */}
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
						{/* REMOVED Percentage text */}
						{/* <p style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.9rem', width: '95%', color: '#555' }}>
               {progress}% Complete
             </p> */}
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
