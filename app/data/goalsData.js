// src/data/goalsData.js (or app/data/goalsData.js)

export const allGoals = [
	{
		id: 1,
		title: "Cooking",
		image: "/goals-images/cooking.jpeg",
		progressKey: "Cooking",
		tasks: [
			"Find cooking class",
			"Cook an egg",
			"Cook pasta",
			"Go to cooking class 2",
		],
		didNotDo: false,
		tracked: true,
	},
	{
		id: 2,
		title: "Learning Spanish",
		image: "/goals-images/learn_spanish.jpeg",
		progressKey: "Learning Spanish",
		tasks: ["Download app", "Practice daily", "Have conversation"],
		didNotDo: false,
		tracked: false,
	},
	{
		id: 3,
		title: "Learning Korean",
		image: "/goals-images/learn_korean.jpeg",
		progressKey: "Learning Korean",
		tasks: ["Learn Hangul", "Practice writing", "Watch a K-drama"],
		didNotDo: false,
		tracked: false,
	},
	{
		id: 4,
		title: "Workout 5 Days a Week",
		image: "/goals-images/gym.jpeg",
		progressKey: "Workout 5 Days a Week",
		tasks: [
			"Create workout plan",
			"Workout Day 1",
			"Workout Day 2",
			"Workout Day 3",
			"Workout Day 4",
			"Workout Day 5",
		],
		didNotDo: false,
		tracked: true,
	},
	{
		id: 5,
		title: "Drink 2 Litres of Water Daily",
		image: "/goals-images/water_bottle.jpeg",
		progressKey: "Drink 2 Litres of Water Daily",
		tasks: ["Buy a water bottle", "Track intake", "Finish 2L by evening"],
		didNotDo: false,
		tracked: true,
	},
	{
		id: 6,
		title: "Read 1 Book a Month",
		image: "/goals-images/reading.jpeg",
		progressKey: "Read 1 Book a Month",
		tasks: ["Pick a book", "Read daily", "Finish book"],
		didNotDo: false,
		tracked: true,
	},
	{
		id: 7,
		title: "Skydiving",
		image: "/goals-images/sky_diving.jpeg",
		progressKey: "Skydiving",
		tasks: ["Find a location", "Book session", "Jump!"],
		didNotDo: true,
		tracked: true,
	},
	{
		id: 8,
		title: "Start a Podcast",
		image: "/goals-images/podcast.jpeg",
		progressKey: "Start a Podcast",
		tasks: ["Pick a topic", "Record first episode", "Launch podcast"],
		didNotDo: true,
		tracked: true,
	},
	// Add other goals if they exist elsewhere
];

// Derive maps from allGoals for consistency
export const goalImageMap = allGoals.reduce((acc, goal) => {
	acc[goal.progressKey] = goal.image;
	return acc;
}, {});

export const goalTasks = allGoals.reduce((acc, goal) => {
	acc[goal.progressKey] = goal.tasks;
	return acc;
}, {});
