// app/components/Goals.js
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Goals.module.css";
import { useSearchParams, useRouter } from "next/navigation";

const Goals = ({ onGoalSelect }) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [category, setCategory] = useState("all");
	const [filteredGoals, setFilteredGoals] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

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

	// --- ADD Mapping for Arrow Colors ---
	const arrowColorClass = {
		all: styles.goalArrowDarkGreen,
		"didnt-do": styles.goalArrowRed,
		"not-started": styles.goalArrowBlue,
		did: styles.goalArrowDoneGreen,
	};
	// --- End Arrow Color Mapping ---

	useEffect(() => {
		const param = searchParams.get("category") || "all";
		setCategory(param);
	}, [searchParams]);

	useEffect(() => {
		async function fetchGoals() {
			setIsLoading(true);
			setError(null);
			setFilteredGoals([]);
			try {
				const response = await fetch(`/api/goals?category=${category}`);
				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(
						`HTTP error! status: ${response.status} - ${
							errorData.message || "Failed to fetch"
						}`
					);
				}
				const data = await response.json();
				setFilteredGoals(data);
			} catch (e) {
				console.error("Failed to fetch goals:", e);
				setError(e.message || "Could not load goals.");
			} finally {
				setIsLoading(false);
			}
		}
		fetchGoals();
	}, [category]);

	const handleNavigateCategory = (cat) => {
		setCategory(cat);
		router.push(`/?category=${cat}`, { scroll: false });
	};

	const handleGoalClick = (goalData) => {
		onGoalSelect(goalData);
	};

	// --- Render Logic ---
	let content;
	if (isLoading) {
		/* ... loading ... */
	} else if (error) {
		/* ... error ... */
	} else if (filteredGoals.length === 0) {
		/* ... no goals ... */
	} else {
		content = filteredGoals.map((goal) => {
			const progress = goal.progress;
			// Get the correct border and arrow class based on the current category
			const currentBorderClass = borderClass[category] || borderClass.all;
			const currentArrowColorClass =
				arrowColorClass[category] || arrowColorClass.all; // Get arrow class

			return (
				<div key={goal.progressKey} className={styles.goalItem}>
					<div className={styles.goalImageWrapper}>
						<Image
							src={goal.image}
							alt={goal.title}
							fill
							className={styles.goalImage}
						/>
					</div>
					<button
						onClick={() => handleGoalClick(goal)}
						className={`${styles.goalDetails} ${currentBorderClass}`} // Apply border class
					>
						<span className={styles.goalTitle}>{goal.title}</span>
						{/* Apply base arrow class AND dynamic color class */}
						<span className={`${styles.goalArrow} ${currentArrowColorClass}`}>
							➝
						</span>
					</button>
					<div className={styles.progressBox}>
						{progress === 100 && (
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
					{/* ... header title logic ... */}
					{category === "did"
						? "Goals I Did"
						: category === "not-started"
						? "Goals Not Started"
						: category === "didnt-do"
						? "Goals I Didn't Do"
						: "Goals I'm Doing"}
				</h1>
			</div>

			{/* Goals List */}
			<div className={styles.goalsList}>{content}</div>

			{/* Legend */}
			<div className={styles.legend}>
				{/* ... legend buttons ... */}
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
