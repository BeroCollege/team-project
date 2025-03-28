// app/components/Goals.js
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Goals.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import { allGoals } from "../data/goalsData";

const Goals = ({ onGoalSelect }) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [category, setCategory] = useState("all");
	const [filteredGoals, setFilteredGoals] = useState([]);

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
		// Default to 'all' if no category param exists
		const param = searchParams.get("category") || "all";
		setCategory(param);
	}, [searchParams]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const updated = allGoals.filter((goal) => {
				const progress =
					parseInt(localStorage.getItem(`progress-${goal.progressKey}`)) || 0;

				if (category === "did") return progress === 100;
				if (category === "not-started") return progress === 0;
				if (category === "didnt-do")
					// Adjust this condition based on how 'didnt-do' is determined
					return ["Skydiving", "Start a Podcast"].includes(goal.title);

				// Default ('all') category filter: show non-completed goals
				return progress < 100;
			});
			setFilteredGoals(updated);
		}
	}, [category]);

	// Keep this handler for the remaining legend buttons
	const handleNavigateCategory = (cat) => {
		setCategory(cat);
		router.push(`/?category=${cat}`, { scroll: false });
	};

	// Keep this handler for selecting a goal
	const handleGoalClick = (goalKey) => {
		onGoalSelect(goalKey);
	};

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
						: "Goals I'm Doing"}{" "}
					{/* Default title */}
				</h1>
			</div>

			{/* Goals List */}
			<div className={styles.goalsList}>
				{filteredGoals.map((goal) => {
					let progress = 0;
					if (typeof window !== "undefined") {
						progress =
							parseInt(localStorage.getItem(`progress-${goal.progressKey}`)) ||
							0;
					}
					const currentBorderClass = borderClass[category] || borderClass.all;

					return (
						<div key={goal.id} className={styles.goalItem}>
							<div className={styles.goalImageWrapper}>
								<Image
									src={goal.image}
									alt={goal.title}
									fill
									className={styles.goalImage}
								/>
							</div>
							<button
								onClick={() => handleGoalClick(goal.progressKey)}
								className={`${styles.goalDetails} ${currentBorderClass}`}
							>
								<span className={styles.goalTitle}>{goal.title}</span>
								<span className={styles.goalArrow}>➝</span>
							</button>
							<div className={styles.progressBox}>
								{progress === 100 && category !== "did" && (
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
				})}
				{filteredGoals.length === 0 && (
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
				)}
			</div>

			{/* Legend - REMOVE the "Goals I'm Doing" button */}
			<div className={styles.legend}>
				<button
					onClick={() => handleNavigateCategory("didnt-do")}
					className={`${styles.legendItem} ${styles.legendItemRed}`}
				>
					<span className={styles.legendEmoji}>✖</span> Goals I Didn't Do
				</button>
				{/* The "Goals I'm Doing" button was here - now removed */}
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
