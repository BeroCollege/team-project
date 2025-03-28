"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Goals.module.css";
import GoalDetailsModal from "./GoalDetailsModal";
import { useSearchParams } from "next/navigation";

// Goals data with tasks for all
const allGoals = [
  {
    id: 1,
    title: "Cooking",
    image: "/goals-images/cooking.jpeg",
    progressKey: "Cooking",
    tasks: ["Find cooking class", "Cook an egg", "Cook pasta", "Go to cooking class 2"]
  },
  {
    id: 2,
    title: "Learning Spanish",
    image: "/goals-images/learn_spanish.jpeg",
    progressKey: "Learning Spanish",
    tasks: ["Download app", "Practice daily", "Have conversation"]
  },
  {
    id: 3,
    title: "Learning Korean",
    image: "/goals-images/learn_korean.jpeg",
    progressKey: "Learning Korean",
    tasks: ["Learn Hangul", "Practice writing", "Watch a K-drama"]
  },
  {
    id: 4,
    title: "Workout 5 Days a Week",
    image: "/goals-images/gym.jpeg",
    progressKey: "Workout 5 Days a Week",
    tasks: ["Create workout plan", "Workout Day 1", "Workout Day 2", "Workout Day 3", "Workout Day 4", "Workout Day 5"]
  },
  {
    id: 5,
    title: "Drink 2 Litres of Water Daily",
    image: "/goals-images/water_bottle.jpeg",
    progressKey: "Drink 2 Litres of Water Daily",
    tasks: ["Buy a water bottle", "Track intake", "Finish 2L by evening"]
  },
  {
    id: 6,
    title: "Read 1 Book a Month",
    image: "/goals-images/reading.jpeg",
    progressKey: "Read 1 Book a Month",
    tasks: ["Pick a book", "Read daily", "Finish book"]
  },
  {
    id: 7,
    title: "Skydiving",
    image: "/goals-images/sky_diving.jpeg",
    progressKey: "Skydiving",
    tasks: ["Find a location", "Book session", "Jump!"] // Tasks added for Skydiving
  },
  {
    id: 8,
    title: "Start a Podcast",
    image: "/goals-images/podcast.jpeg",
    progressKey: "Start a Podcast",
    tasks: ["Pick a topic", "Record first episode", "Launch podcast"] // Tasks added for Start a Podcast
  },
];

const Goals = () => {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState("all");
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const colorClass = {
    all: "headerGreen",
    "didnt-do": "headerRed",
    "not-started": "headerBlue",
    did: "headerDoneGreen",
  };

  useEffect(() => {
    const param = searchParams.get("category") || "all";
    setCategory(param);
  }, [searchParams]);

  useEffect(() => {
    const updated = allGoals.filter((goal) => {
      const progress =
        parseInt(localStorage.getItem(`progress-${goal.progressKey}`)) || 0;
      if (category === "did") return progress === 100;
      if (category === "not-started") return progress === 0;
      if (category === "didnt-do")
        return ["Skydiving", "Start a Podcast"].includes(goal.title); // Keep Skydiving and Podcast in "Didnt-Do"
      return true;
    });
    setFilteredGoals(updated);
  }, [category]);

  const handleNavigate = (cat) => {
    setCategory(cat);
    window.history.replaceState(null, "", `/?category=${cat}`);
  };

  return (
    <div className={styles.goalsContainer}>
      <div className={`${styles.header} ${styles[colorClass[category]]}`}>
        <h1>Goals</h1>
      </div>

      <div className={styles.goalsList}>
        {filteredGoals.map((goal) => {
          const progress =
            parseInt(localStorage.getItem(`progress-${goal.progressKey}`)) || 0;

          const borderColorClass =
            category === "didnt-do"
              ? styles.goalRedBorder
              : category === "not-started"
              ? styles.goalBlueBorder
              : category === "did"
              ? styles.goalDoneGreenBorder
              : styles.goalDarkGreenBorder;

          return (
            <div key={goal.id} className={styles.goalItem}>
              <div className={styles.goalImageWrapper}>
                {progress === 100 && (
                  <Image
                    src="/goals-images/medal.png"
                    alt="Medal"
                    width={40}
                    height={40}
                    className={styles.medalIcon}
                  />
                )}
                <Image
                  src={goal.image}
                  alt={goal.title}
                  fill
                  className={styles.goalImage}
                />
              </div>

              <button
                onClick={() => setSelectedGoal(goal.progressKey)}
                className={`${styles.goalDetails} ${borderColorClass}`}
              >
                <span className={styles.goalTitle}>{goal.title}</span>
                <span className={styles.goalArrow}>➝</span>
              </button>

              <div className={styles.progressBox}>
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

      {/* Bottom Nav Buttons */}
      <div className={styles.legend}>
        <button
          onClick={() => handleNavigate("didnt-do")}
          className={`${styles.legendItem} ${styles.legendItemRed}`}
        >
          <span className={styles.legendEmoji}>✖</span> Goals I Didn't Do
        </button>
        <button
          onClick={() => handleNavigate("not-started")}
          className={`${styles.legendItem} ${styles.legendItemBlue}`}
        >
          <span className={styles.legendEmoji}>🔵</span> Goals Not Started
        </button>
        <button
          onClick={() => handleNavigate("did")}
          className={`${styles.legendItem} ${styles.legendItemGreen}`}
        >
          <span className={styles.legendEmoji}>✔</span> Goals I Did
        </button>
      </div>

      {/* Modal */}
      {selectedGoal && (
        <GoalDetailsModal
          goalTitle={selectedGoal}
          onClose={() => setSelectedGoal(null)}
        />
      )}
    </div>
  );
};

export default Goals;
