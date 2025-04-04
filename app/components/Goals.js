// app/components/Goals.js
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Goals.module.css";
import { useSearchParams, useRouter } from "next/navigation";
// Remove static data import - data now comes from API
// import { allGoals } from "../data/goalsData";

// --- Accept onGoalSelect prop ---
const Goals = ({ onGoalSelect }) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [category, setCategory] = useState("all");
	const [filteredGoals, setFilteredGoals] = useState([]); // Holds goals fetched from API
	const [isLoading, setIsLoading] = useState(true); // Loading state
	const [error, setError] = useState(null); // Error state

	const colorClass = {
		all: styles.headerGreen,
		"didnt-do": styles.headerRed,
		"not-started": styles.headerBlue,
		did: styles.headerDoneGreen,
	};

	const borderClass = {
		all: styles.goalDarkGreenBorder,
		"didnt-do": styles.goalRedBorder,
		"not-started": styles.goalBlueBorder,
		did: styles.goalDoneGreenBorder,
	};

	useEffect(() => {
		// Set category from URL param on initial load or change
		const param = searchParams.get("category") || "all";
		setCategory(param);
	}, [searchParams]);

	// --- Fetch goals from API based on category ---
	useEffect(() => {
		async function fetchGoals() {
			setIsLoading(true);
			setError(null);
			setFilteredGoals([]); // Clear previous goals
			try {
				// Fetch goals using the API route and category query parameter
				const response = await fetch(`/api/goals?category=${category}`);
				if (!response.ok) {
					// Handle HTTP errors (like 404, 500)
					const errorData = await response.json().catch(() => ({})); // Try to get error message
					throw new Error(
						`HTTP error! status: ${response.status} - ${
							errorData.message || "Failed to fetch"
						}`
					);
				}
				const data = await response.json();
				setFilteredGoals(data); // Update state with fetched goals
			} catch (e) {
				console.error("Failed to fetch goals:", e);
				setError(e.message || "Could not load goals."); // Store error message
			} finally {
				setIsLoading(false); // Stop loading indicator
			}
		}

		fetchGoals(); // Call the fetch function
	}, [category]); // Re-fetch whenever the category state changes

	// Handler for category buttons in the legend
	const handleNavigateCategory = (cat) => {
		// Update category state, which triggers the useEffect above to fetch new data
		setCategory(cat);
		// Update the URL query parameter for bookmarking/sharing
		router.push(`/?category=${cat}`, { scroll: false });
	};

	// --- Handler for clicking a goal item ---
	// It receives the full goal object (fetched from API) and passes it up
	const handleGoalClick = (goalData) => {
		console.log("Goals.js: Clicking goal, data:", goalData);
		onGoalSelect(goalData); // Pass the complete object to page.js
	};

	// --- Render Logic ---
	let content;
	if (isLoading) {
		content = (
			<p style={{ textAlign: "center", marginTop: "2rem" }}>Loading goals...</p>
		);
	} else if (error) {
		content = (
			<p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
				Error: {error}
			</p>
		);
	} else if (filteredGoals.length === 0) {
		content = (
			<p
				style={{
					textAlign: "center",
					marginTop: "2rem",
					fontSize: "1.2rem",
					color: "#666",
				}}
			>
				No goals match the current filter.
			</p>
		);
	} else {
		// Map over the goals received from the API
		content = filteredGoals.map((goal) => {
			const progress = goal.progress; // Progress comes from API data
			const currentBorderClass = borderClass[category] || borderClass.all;
			return (
				// Use progressKey for a stable key
				<div key={goal.progressKey} className={styles.goalItem}>
					<div className={styles.goalImageWrapper}>
						<Image
							src={goal.image} // Use image from API data
							alt={goal.title} // Use title from API data
							fill
							className={styles.goalImage}
						/>
					</div>
					{/* Pass the full 'goal' object on click */}
					<button
						onClick={() => handleGoalClick(goal)}
						className={`${styles.goalDetails} ${currentBorderClass}`}
					>
						<span className={styles.goalTitle}>{goal.title}</span>
						<span className={styles.goalArrow}>➝</span>
					</button>
					<div className={styles.progressBox}>
						{progress === 100 && ( // Medal logic (shows if 100%)
							<Image
								src="/goals-images/medal.png"
								alt="Medal"
								width={40}
								height={40}
								className={styles.progressMedal}
							/>
						)}
						<span className={styles.progressText}>Progress</span>
						<div className={styles.progressBar}>
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
			);
		});
	}

	return (
		<div className={styles.goalsContainer}>
			{/* Header */}
			<div
				className={`${styles.header} ${
					colorClass[category] || styles.headerGreen
				}`}
			>
				<h1>
					{category === "did"
						? "Goals I Did"
						: category === "not-started"
						? "Goals Not Started"
						: category === "didnt-do"
						? "Goals I Didn't Do"
						: "Goals I'm Doing"}
				</h1>
			</div>

			{/* Render loading/error/goals list */}
			<div className={styles.goalsList}>{content}</div>

			{/* Legend */}
			<div className={styles.legend}>
				<button
					onClick={() => handleNavigateCategory("didnt-do")}
					className={`${styles.legendItem} ${styles.legendItemRed}`}
				>
					<span className={styles.legendEmoji}>✖</span> Goals I Didn't Do
				</button>
				<button
					onClick={() => handleNavigateCategory("not-started")}
					className={`${styles.legendItem} ${styles.legendItemBlue}`}
				>
					<span className={styles.legendEmoji}>🔵</span> Goals Not Started
				</button>
				<button
					onClick={() => handleNavigateCategory("did")}
					className={`${styles.legendItem} ${styles.legendItemGreen}`}
				>
					<span className={styles.legendEmoji}>✔</span> Goals I Did
				</button>
			</div>
		</div>
	);
};

export default Goals;
