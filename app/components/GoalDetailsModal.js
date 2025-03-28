"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Goals.module.css"; // Reuse existing styles

// Goal image mapping
const goalImageMap = {
  Cooking: "/goals-images/cooking.jpeg",
  "Learning Spanish": "/goals-images/learn_spanish.jpeg",
  "Learning Korean": "/goals-images/learn_korean.jpeg",
  "Workout 5 Days a Week": "/goals-images/gym.jpeg",
  "Drink 2 Litres of Water Daily": "/goals-images/water_bottle.jpeg",
  "Read 1 Book a Month": "/goals-images/reading.jpeg",
  "Finished a Book": "/goals-images/book.jpeg",
  "Completed Marathon": "/goals-images/marathon.jpeg",
  "Learn Guitar": "/goals-images/guitar.jpeg",
  "Take Art Classes": "/goals-images/art_class.jpeg",
  Skydiving: "/goals-images/sky_diving.jpeg",
  "Start a Podcast": "/goals-images/podcast.jpeg",
};

// Task mapping for goals
const goalTasks = {
  Cooking: ["Find cooking class", "Cook an egg", "Cook pasta", "Go to cooking class 2"],
  "Learning Spanish": ["Download app", "Practice daily", "Have conversation"],
  "Learning Korean": ["Learn Hangul", "Practice writing", "Watch a K-drama"],
  "Workout 5 Days a Week": ["Create workout plan", "Workout Day 1", "Workout Day 2", "Workout Day 3", "Workout Day 4", "Workout Day 5"],
  "Drink 2 Litres of Water Daily": ["Buy a water bottle", "Track intake", "Finish 2L by evening"],
  "Read 1 Book a Month": ["Pick a book", "Read daily", "Finish book"],
  Skydiving: ["Find a location", "Book session", "Jump!"], // Tasks for Skydiving
  "Start a Podcast": ["Pick a topic", "Record first episode", "Launch podcast"], // Tasks for Start a Podcast
};

export default function GoalDetailsModal({ goalTitle, onClose }) {
  const [statuses, setStatuses] = useState([]);
  const tasks = goalTasks[goalTitle] || [];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`status-${goalTitle}`)) || Array(tasks.length).fill(0);
    setStatuses(stored);
  }, [goalTitle]);

  const updateStatus = (index) => {
    const newStatuses = [...statuses];
    newStatuses[index] = (newStatuses[index] + 1) % 3; // cycle 0 → 1 → 2
    setStatuses(newStatuses);
    localStorage.setItem(`status-${goalTitle}`, JSON.stringify(newStatuses));

    // update progress percent
    const completed = newStatuses.filter((s) => s === 2).length;
    const progress = Math.round((completed / tasks.length) * 100);
    localStorage.setItem(`progress-${goalTitle}`, progress);
  };

  const renderStep = (task, index) => {
    const status = statuses[index];
    let prefix = "🔵";
    let bgColor = "#2872DD";

    if (status === 1) {
      prefix = "❌";
      bgColor = "#DD284A";
    } else if (status === 2) {
      prefix = "✔";
      bgColor = "#27BE1C";
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
          fontSize: "1.1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",  // Center the text within the button
          cursor: "pointer",
          width: "100%",  // Make sure the buttons stretch across the screen
          boxShadow: "none", // Removed shadow for a flat design
        }}
      >
        <span>{`${prefix} ${task}`}</span>
      </button>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          maxWidth: "1000px",
          width: "90%",
          padding: "2rem",
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            background: "#ddd",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        {/* Left: Image + progress */}
        <div style={{ flex: 1 }}>
          <Image
            src={goalImageMap[goalTitle] || "/goals-images/cooking.jpeg"}
            alt={goalTitle}
            width={600}
            height={350}
            style={{ borderRadius: "15px", objectFit: "cover" }}
          />

          <div style={{ marginTop: "2rem" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Progress</p>
            <div
              style={{
                backgroundColor: "#ddd",
                height: "30px",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${
                    Math.round((statuses.filter((s) => s === 2).length / tasks.length) * 100)
                  }%`,
                  backgroundColor:
                    statuses.filter((s) => s === 2).length === tasks.length
                      ? "#27BE1C"
                      : "#FFCC00",
                  transition: "width 0.4s ease-in-out",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right: Title + actions */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>{goalTitle} Goal</h1>
          <div>{tasks.map(renderStep)}</div>
        </div>
      </div>
    </div>
  );
}
