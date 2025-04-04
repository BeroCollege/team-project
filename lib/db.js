// lib/db.js (Create this file inside the 'lib' folder)

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node"; // Adapter for reading/writing JSON files in Node.js
import path from "path";

// Define the default data structure.
// This is what db.json will contain if it's empty or doesn't exist yet.
const defaultData = {
	// userGoals will store objects keyed by "userId_goalKey"
	// e.g., "localuser_Cooking": { progress: 50, taskStatuses: [2, 1, 0, 0] }
	userGoals: {},
};

// --- Determine the path to db.json ---
// process.cwd() gives the root directory of your Next.js project
const dbFilePath = path.join(process.cwd(), "db.json");
// console.log(`Database path: ${dbFilePath}`); // Optional: Log path for debugging

// --- Configure lowdb ---
// 1. Create an adapter for the JSON file
const adapter = new JSONFile(dbFilePath);

// 2. Create the lowdb instance with the adapter and default data
//    <typeof defaultData> provides type safety if you use TypeScript later
const db = new Low(adapter, defaultData);

// --- Helper function ---
// Ensures the database file is read before you try to access db.data
// Call this at the beginning of your API route handlers.
export async function readDbData() {
	await db.read(); // Reads the file content into db.data

	// If the file was empty or didn't exist, db.data might be null.
	// Ensure db.data and db.data.userGoals exist.
	db.data = db.data || defaultData;
	db.data.userGoals = db.data.userGoals || {};
}

// Export the db instance and the helper function
export { db };

// Note: You will call `await db.write()` in your API routes AFTER modifying db.data to save changes.
