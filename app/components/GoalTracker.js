// app/components/Goals.js
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Goals.module.css";

const goalData = [
  { id: 1, title: "Cooking", image: "cooking.jpeg", alt: "Person cooking food in a pan" },
  { id: 2, title: "Learning Spanish", image: "learn_spanish.jpeg", alt: "Person sleeping on a couch with a Spanish grammar book" },
  { id: 3, title: "Learning Korean", image: "learn_korean.jpeg", alt: "Sticky notes on a board" },
  { id: 4, title: "Workout 5 Days a Week", image: "gym.jpeg", alt: "Dumbbells on a rack" },
  { id: 5, title: "Drink 2 Litres of Water Daily", image: "water_bottle.jpeg", alt: "Person holding a water bottle" },
  { id: 6, title: "Read 1 Book a Month", image: "reading.jpeg", alt: "Open book on a table" }
];

const Goals = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const enrichedGoals = goalData.map((goal) => {
      const progress = parseInt(localStorage.getItem(`progress-${goal.title}`)) || 0;
      return { ...goal, progress };
    });
    setGoals(enrichedGoals);
  }, []);

  return (
    <div className={styles.goalsContainer}>
      <div className={styles.header}>
        <h1>Goals</h1>
      </div>

      <div className={styles.goalsList}>
        {goals.map((goal) => {
          const progressPercentage = Math.max(0, Math.min(100, goal.progress || 0));
          const isComplete = progressPercentage === 100;
          const isActive = progressPercentage > 0 && progressPercentage < 100;

          return (
            <div key={goal.id} className={styles.goalItem}>
              <div className={styles.goalImageWrapper}>
                <Image
                  src={`/goals-images/${goal.image}`}
                  alt={goal.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 200px"
                  className={styles.goalImage}
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
                      isComplete
                        ? styles.progressBarComplete
                        : isActive
                        ? styles.progressBarActive
                        : ""
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.legend}>
        <div className={`${styles.legendItem} ${styles.legendItemRed}`}>
          <span className={styles.legendEmoji}>❌</span> Goals I Didn't Do
        </div>
        <div className={`${styles.legendItem} ${styles.legendItemBlue}`}>
          <span className={styles.legendEmoji}>🔵</span> Goals Not Started
        </div>
        <div className={`${styles.legendItem} ${styles.legendItemGreen}`}>
          <span className={styles.legendEmoji}>✔</span> Goals I Did
        </div>
      </div>
    </div>
  );
};

export default Goals;
