// app/api/goals/route.js
import { NextResponse } from "next/server";
import { db, readDbData } from "../../../lib/db"; // Use correct alias/path
import { allGoals } from "@/app/data/goalsData"; // Use correct alias/path

const USER_ID = "localuser";

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const category = searchParams.get("category") || "all";

	try {
		await readDbData();
		const userProgressData = db.data.userGoals || {};

		// Merge static data (including didNotDo and tracked flags) with progress data
		const mergedGoals = allGoals.map((staticGoal) => {
			const goalKey = staticGoal.progressKey;
			const dbKey = `${USER_ID}_${goalKey}`;
			const progressData = userProgressData[dbKey];

			return {
				...staticGoal, // Includes id, title, image, tasks, didNotDo, tracked
				progress: progressData?.progress ?? 0,
				taskStatuses:
					progressData?.taskStatuses ?? Array(staticGoal.tasks.length).fill(0),
			};
		});

		// --- Updated Filtering Logic ---
		const filteredGoals = mergedGoals.filter((goal) => {
			const progress = goal.progress;
			const didNotDoFlag = goal.didNotDo;
			const isTrackedFlag = goal.tracked; // Use the static flag from goalsData.js

			// Priority 1: Handle the "Didn't Do" category exclusively
			// If didNotDo is true, it only shows up if category is 'didnt-do'
			if (didNotDoFlag === true) {
				return category === "didnt-do";
			}

			// If we reach here, didNotDo is false. Now filter based on category:
			if (category === "did") {
				return progress === 100;
			}
			if (category === "not-started") {
				// Show if progress is 0 (and didNotDo is false)
				return progress === 0;
			}
			if (category === "didnt-do") {
				// This case is already handled by the first check, but included for clarity
				return false; // Only didNotDo:true goals are shown above
			}

			// Default ('all' / Goals I'm Doing) category filter:
			// Show if the static 'tracked' flag is true AND goal is not completed
			return isTrackedFlag === true && progress < 100;
		});
		// --- End Updated Filtering Logic ---

		return NextResponse.json(filteredGoals);
	} catch (error) {
		console.error("Failed to fetch goals:", error);
		return NextResponse.json(
			{ message: "Failed to fetch goals" },
			{ status: 500 }
		);
	}
}
