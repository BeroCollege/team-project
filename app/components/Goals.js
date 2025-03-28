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

	// ... (colorClass, borderClass, useEffects, handlers remain the same) ...
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
					return ["Skydiving", "Start a Podcast"].includes(goal.title);
				return true;
			});
			setFilteredGoals(updated);
		}
	}, [category]);

	const handleNavigateCategory = (cat) => {
		setCategory(cat);
		router.push(`/?category=${cat}`, { scroll: false });
	};

	const handleGoalClick = (goalKey) => {
		onGoalSelect(goalKey);
	};

	return (
		<div className={styles.goalsContainer}>
			<div className={`${styles.header} ${colorClass[category]}`}>
				<h1>Goals</h1>
			</div>

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
							{/* Goal Image Wrapper - MEDAL REMOVED FROM HERE */}
							<div className={styles.goalImageWrapper}>
								{/* {progress === 100 && ( ... medal was here ... )} */}
								<Image
									src={goal.image}
									alt={goal.title}
									fill
									className={styles.goalImage}
								/>
							</div>

							{/* Goal Details Button */}
							<button
								onClick={() => handleGoalClick(goal.progressKey)}
								className={`${styles.goalDetails} ${currentBorderClass}`}
							>
								<span className={styles.goalTitle}>{goal.title}</span>
								<span className={styles.goalArrow}>➝</span>
							</button>

							{/* Progress Box - MEDAL MOVED HERE */}
							<div className={styles.progressBox}>
								{/* Conditionally render medal *inside* progressBox */}
								{progress === 100 && (
									<Image
										src="/goals-images/medal.png"
										alt="Medal"
										width={40} // Adjust size if needed
										height={40} // Adjust size if needed
										// Apply new style for positioning within progress box
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
			</div>

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
