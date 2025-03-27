// app/components/Goals.js
import React from "react";
import Image from "next/image";
import styles from "./Goals.module.css";

// Sample data
const goalsData = [
	{
		id: 1,
		title: "Cooking",
		imageSrc: "/goals-images/cooking.jpeg",
		alt: "Person cooking food in a pan",
		progress: 50,
	},
	{
		id: 2,
		title: "Learning Spanish",
		imageSrc: "/goals-images/learn_spanish.jpeg",
		alt: "Person sleeping on a couch with a Spanish grammar book",
		progress: 0,
	},
	{
		id: 3,
		title: "Learning Korean",
		imageSrc: "/goals-images/learn_korean.jpeg",
		alt: "Sticky notes on a board",
		progress: 100,
	},
	{
		id: 4,
		title: "Workout 5 Days a Week",
		imageSrc: "/goals-images/gym.jpeg",
		alt: "Dumbbells on a rack",
		progress: 75,
	},
];

const Goals = () => {
	return (
		<div className={styles.goalsContainer}>
			<div className={styles.header}>
				<h1>Goals</h1>
			</div>

			<div className={styles.goalsList}>
				{goalsData.map((goal) => {
					const progressPercentage = Math.max(
						0,
						Math.min(100, goal.progress || 0)
					);
					const isComplete = progressPercentage === 100;
					const isActive = progressPercentage > 0 && progressPercentage < 100;

					return (
						<div key={goal.id} className={styles.goalItem}>
							<div className={styles.goalImageWrapper}>
								<Image
									src={goal.imageSrc}
									alt={goal.alt}
									fill
									sizes="(max-width: 768px) 100vw, 200px"
									className={styles.goalImage}
									onError={(e) => {
										e.target.src = "/profile_placeholder.png";
										e.target.alt = "Image not found";
									}}
								/>
							</div>
							<div className={styles.goalDetails}>
								<span className={styles.goalTitle}>{goal.title}</span>
								<span className={styles.goalArrow}>➔</span>
							</div>
							<div className={styles.progressBox}>
								<span className={styles.progressText}>Progress</span>
								<div className={styles.progressBar}>
									<div
										className={`${styles.progressBarInner} ${
											isComplete ? styles.progressBarComplete : ""
										} ${isActive ? styles.progressBarActive : ""}`}
										style={{ width: `${progressPercentage}%` }}
									></div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Legend */}
			<div className={styles.legend}>
				<div className={`${styles.legendItem} ${styles.legendItemRed}`}>
					{/* Emoji span */}
					<span className={styles.legendEmoji}>❌</span> Goals I Didn't Do
				</div>
				<div className={`${styles.legendItem} ${styles.legendItemBlue}`}>
					{/* Emoji span */}
					<span className={styles.legendEmoji}>🔵</span> Goals Not Started
				</div>
				<div className={`${styles.legendItem} ${styles.legendItemGreen}`}>
					{/* Emoji span - Changed Emoji */}
					<span className={styles.legendEmoji}>✔</span> Goals I Did
				</div>
			</div>
		</div>
	);
};

export default Goals;
