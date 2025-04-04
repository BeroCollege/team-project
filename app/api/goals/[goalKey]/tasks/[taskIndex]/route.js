// app/api/goals/[goalKey]/tasks/[taskIndex]/route.js
import { NextResponse } from "next/server";
// --- Corrected Relative Paths ---
import { db, readDbData } from "../../../../../../lib/db"; // Still need relative path for lib (6 levels up)
import { allGoals } from "@/app/data/goalsData"; // Use alias for app/data
// --- End Corrections ---

const USER_ID = "localuser";

export async function PUT(request, { params }) {
	const { goalKey, taskIndex } = params;
	const { newStatus } = await request.json();

	if (
		!goalKey ||
		taskIndex === undefined ||
		newStatus === undefined ||
		![0, 1, 2].includes(newStatus)
	) {
		return NextResponse.json(
			{ message: "Invalid request parameters" },
			{ status: 400 }
		);
	}

	const taskIndexNum = parseInt(taskIndex, 10);
	const dbKey = `${USER_ID}_${goalKey}`;

	try {
		await readDbData();

		const staticGoal = allGoals.find((g) => g.progressKey === goalKey);
		if (!staticGoal) {
			return NextResponse.json(
				{ message: "Goal definition not found" },
				{ status: 404 }
			);
		}
		const totalTasks = staticGoal.tasks.length;

		const currentData = db.data.userGoals[dbKey] || {
			progress: 0,
			taskStatuses: Array(totalTasks).fill(0),
		};
		const currentStatuses = Array.isArray(currentData.taskStatuses)
			? [...currentData.taskStatuses]
			: Array(totalTasks).fill(0);

		if (taskIndexNum < 0 || taskIndexNum >= currentStatuses.length) {
			return NextResponse.json(
				{ message: "Invalid task index" },
				{ status: 400 }
			);
		}

		currentStatuses[taskIndexNum] = newStatus;

		const completedTasks = currentStatuses.filter((s) => s === 2).length;
		const newProgress =
			totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

		const updatedData = {
			progress: newProgress,
			taskStatuses: currentStatuses,
		};

		db.data.userGoals[dbKey] = updatedData;
		await db.write();

		return NextResponse.json({
			goalKey: goalKey,
			progress: newProgress,
			taskStatuses: currentStatuses,
		});
	} catch (error) {
		console.error(`Failed to update task for ${goalKey}:`, error);
		return NextResponse.json(
			{ message: "Failed to update task status" },
			{ status: 500 }
		);
	}
}
